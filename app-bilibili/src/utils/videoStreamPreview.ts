import { getHomeVideoStream } from '@/api/home';
import throttle from '@/utils/common/throttle.js';
import { AxiosResponse } from 'axios';
import type { Ref } from 'vue';
interface Segment {
    offset: number;
    referenceType: number;
    referencedSize: number;
    segmentEndTime: number;
    segmentStartTime: number;
    subsegmentDuration: number;
};
export default async (videosStreamInfo: Record<string, any>, index: number, videoItem: Record<string, any>, videoRefs: Ref<HTMLVideoElement[]>, videoBlobUrls: Ref<string[]>, curMouseIndex: Ref<number>) => {
    try {
        if(videoItem.videoSrc) {
            const videoStreamUrl = formatVideoUrl(videosStreamInfo[videoItem.supportIndex].baseUrl);
            const indexRange = videosStreamInfo[videoItem.supportIndex].SegmentBase.indexRange;
            const arrayBuffer = await fetchVideoArrayBuffer(videoStreamUrl, indexRange);
            const lastSegments = parseSidx(arrayBuffer) || [];

            let isLoading = false;
            videoItem.handleTimeUpdate = throttle(async () => {
                const during = getSourceBufferDuring(videoItem.videoSourceBuffer);
                // 定期清理缓冲
                if (during > 30) {
                    if (!videoItem.videoSourceBuffer.updating) {
                        await new Promise(resolve => {
                            // 删除缓冲区前面的部分，保留当前播放时间之前的5秒
                            videoItem.videoSourceBuffer.remove(0, videoRefs.value[index].currentTime - 5);
                            // 等待删除完成
                            videoItem.videoSourceBuffer.addEventListener('updateend', resolve, { once: true });
                        });
                    };
                };
                if(isLoading === true) return;
                isLoading = true;
                await loadChunk(index, videoItem.videoSourceBuffer, videoStreamUrl, lastSegments);
                isLoading = false;
            }, 1000);
            await loadChunk(index, videoItem.videoSourceBuffer, videoStreamUrl, lastSegments);
            if(curMouseIndex.value === index) {
                videoRefs.value[index].addEventListener('timeupdate', videoItem.handleTimeUpdate);
                videoRefs.value[index].play();
            };
        }
        else {
            for(let i = 0; i < videosStreamInfo.length; i++) {
                const mimeCodec = `${videosStreamInfo[i].mimeType}; codecs=${videosStreamInfo[i].codecs}`;
                // 检查浏览器是否支持该类型编码器
                if(MediaSource.isTypeSupported(mimeCodec)) {
                    const mediaSource = new MediaSource();
                    const videoStreamUrl = formatVideoUrl(videosStreamInfo[i].baseUrl);
                    // 在 DASH 方式下，关键帧信息移到了 sidx box 里
                    const initialization = videosStreamInfo[i].SegmentBase.Initialization;
                    const indexRange = videosStreamInfo[i].SegmentBase.indexRange;

                    videoItem.mediaSource = mediaSource;
                    videoItem.supportIndex = i;
                    videoItem.videoSrc = URL.createObjectURL(mediaSource);
                    videoBlobUrls.value.push(videoItem.videoSrc);
                    videoItem.lastSegmentIndex = 0;
                    videoItem.startRange = 0;
                    mediaSource.addEventListener('sourceopen', sourceOpen);
                    
                    async function sourceOpen() {
                        // 创建 SourceBuffer
                        videoItem.videoSourceBuffer = mediaSource.addSourceBuffer(mimeCodec);
                        let arrayBuffer = await fetchVideoArrayBuffer(videoStreamUrl, initialization);
                        await insertStream(videoItem.videoSourceBuffer, arrayBuffer);

                        arrayBuffer = await fetchVideoArrayBuffer(videoStreamUrl, indexRange);
                        const lastSegments = parseSidx(arrayBuffer) || [];
                        await insertStream(videoItem.videoSourceBuffer, arrayBuffer);

                        // videoItem.handleTimeUpdate = throttle(async () => {
                        //     await loadChunk(index, videoItem.videoSourceBuffer, videoStreamUrl, lastSegments);
                        // }, 1000);
                        // await loadChunk(index, videoItem.videoSourceBuffer, videoStreamUrl, lastSegments);
                        // if(curMouseIndex.value === index) {
                        //     videoRefs.value[index].addEventListener('timeupdate', videoItem.handleTimeUpdate);
                        //     videoRefs.value[index].play();
                        // };
                        
                        let isLoading = false;
                        videoItem.handleTimeUpdate = throttle(async () => {
                            const during = getSourceBufferDuring(videoItem.videoSourceBuffer);
                            // 定期清理缓冲
                            if (during > 30) {
                                if (!videoItem.videoSourceBuffer.updating) {
                                    await new Promise(resolve => {
                                        // 删除缓冲区前面的部分，保留当前播放时间之前的5秒
                                        videoItem.videoSourceBuffer.remove(0, videoRefs.value[index].currentTime - 5);
                                        // 等待删除完成
                                        videoItem.videoSourceBuffer.addEventListener('updateend', resolve, { once: true });
                                    });
                                };
                            };
                            if(isLoading === true) return;
                            isLoading = true;
                            await loadChunk(index, videoItem.videoSourceBuffer, videoStreamUrl, lastSegments);
                            isLoading = false;
                        }, 1000);
                        await loadChunk(index, videoItem.videoSourceBuffer, videoStreamUrl, lastSegments);
                        if(curMouseIndex.value === index) {
                            videoRefs.value[index].addEventListener('timeupdate', videoItem.handleTimeUpdate);
                            videoRefs.value[index].play();
                        };
                    };
                    break;
                };
            };
        };
        async function loadChunk(index: number, sourceBuffer: SourceBuffer , videoStreamUrl: string, lastSegments: Segment[]) {
            if (!sourceBuffer.updating && videoItem.mediaSource.readyState === 'open' && shouldLoadNextSegment(index)) {
                if(videoItem.lastSegmentIndex < lastSegments.length) {
                    const range = `${videoItem.startRange}-${videoItem.startRange + lastSegments[videoItem.lastSegmentIndex].referencedSize}`;
                    // 加载片段到 SourceBuffer
                    const arrayBuffer = await fetchVideoArrayBuffer(videoStreamUrl, range);
                    await insertStream(sourceBuffer, arrayBuffer);
                    handleLoadChunk(lastSegments);
                }
                else {
                    // 当所有片段加载完成后，结束流
                    videoItem.mediaSource.endOfStream();
                    videoRefs.value[index].removeEventListener('timeupdate', videoItem.handleTimeUpdate);
                    videoItem.handleTimeUpdate = null;
                };
            };
        };
        function handleLoadChunk(lastSegments: Segment[] = []): void {
            videoItem.startRange = videoItem.startRange + lastSegments[videoItem.lastSegmentIndex].referencedSize + 1;
            videoItem.lastSegmentIndex++;
        };
        function insertStream(sourceBuffer: SourceBuffer, arrayBuffer: ArrayBuffer) {
            return new Promise(resolve => {
                sourceBuffer.addEventListener('updateend', function updateListener() {
                    // 移除事件监听器
                    sourceBuffer.removeEventListener('updateend', updateListener);
                    resolve(arrayBuffer);
                });
                sourceBuffer.appendBuffer(arrayBuffer);
            });
        };
        async function fetchVideoArrayBuffer(videoStreamUrl: string, range: string): Promise<ArrayBuffer> {
            const response: AxiosResponse = await getHomeVideoStream({ videoStreamUrl }, range);
            const arrayBuffer = response.data;
            return arrayBuffer;
        };
        function parseSidx(buffer: ArrayBuffer): Segment[] | undefined {
            const view = new DataView(buffer);
            let offset = 0;
        
            // 跳过 sidx box header (通常是8字节)
            const sidxBoxType = String.fromCharCode(
                view.getUint8(offset + 4),
                view.getUint8(offset + 5),
                view.getUint8(offset + 6),
                view.getUint8(offset + 7)
            );
        
            if (sidxBoxType !== 'sidx') {
                // 不是 sidx box 的情况
                return;
            }
        
            offset += 8;  // 跳过 header
        
            // 读取 Version 和 flags
            const version = view.getUint8(offset);
            offset += 4;  // 跳过 version 和 flags
        
            // 读取 Timescale
            const timescale = view.getUint32(offset + 4);
            offset += 8;
        
            // 读取 Earliest Presentation Time 和 First Offset (根据 version 判断)
            let earliestPresentationTime: number | bigint;
            let firstOffset: number | bigint;
            if (version === 0) {
                earliestPresentationTime = view.getUint32(offset);
                firstOffset = view.getUint32(offset + 4);
                offset += 8;
            } else {
                earliestPresentationTime = view.getBigUint64(offset);
                firstOffset = view.getBigUint64(offset + 8);
                offset += 16;
            }
        
            // 跳过保留字段
            offset += 2;
        
            // 读取 Reference Count
            const referenceCount = view.getUint16(offset);
            offset += 2;
        
            // 解析每个参考（reference）
            const segments: Segment[] = [];
            for (let i = 0; i < referenceCount; i++) {
                const reference = view.getUint32(offset);
                const referenceType = (reference >>> 31) & 1;  // 获取 Reference Type
                const referencedSize = reference & 0x7FFFFFFF; // 获取 Referenced Size（31位）
        
                const subsegmentDuration = view.getUint32(offset + 4);
        
                // 更新偏移量
                offset += 12;  // 跳过 reference, duration, flags
        
                // 计算 segment 的开始和结束时间
                const segmentStartTime = Number(earliestPresentationTime) / timescale;
                const segmentEndTime = segmentStartTime + subsegmentDuration / timescale;
        
                // 推入 segments 数组
                segments.push({
                    referenceType,
                    referencedSize,
                    subsegmentDuration,
                    segmentStartTime,
                    segmentEndTime,
                    offset: Number(firstOffset) + offset  // 计算片段的实际偏移量
                });
        
                // 更新 earliestPresentationTime
                earliestPresentationTime = BigInt(earliestPresentationTime) + BigInt(subsegmentDuration);
            }
        
            return segments;
        }
        // 获取播放进度前的缓存长度
        function getSourceBufferDuring(sourceBuffer: SourceBuffer) {
            const buffered = sourceBuffer.buffered;
            let totalBuffered = 0;
            for (let i = 0; i < buffered.length; i++) {
                if(buffered.end(i) > videoRefs.value[index].currentTime) totalBuffered += videoRefs.value[index].currentTime - buffered.start(i);
                else totalBuffered += buffered.end(i) - buffered.start(i);
            };
            return totalBuffered;
        };
        function shouldLoadNextSegment(index: number) {
            const currentTime = videoRefs.value[index].currentTime;
            const buffered = videoRefs.value[index].buffered;
            
            if(buffered.length === 0) return true;
            // 检查当前时间与已缓冲区域的差距
            for (let i = 0; i < buffered.length; i++) {
                console.log(buffered.start(i) + ' &&&& ' + buffered.end(i) + '&&&&' + currentTime, index);
                if (currentTime >= buffered.start(i) && currentTime < buffered.end(i)) {
                    // 如果当前播放位置距离缓冲区域尾端不足 10 秒，开始加载下一段
                    if (buffered.end(i) - currentTime < 5) {
                        return true;
                    };
                };
            };
            return false;
        };
        function formatVideoUrl(str: string) {
            // unicode 转义
            const formatUnicodeStr = str.replace(/\\u[\dA-Fa-f]{4}/g, (match) => {
                return String.fromCharCode(parseInt(match.replace('\\u', ''), 16));
            });
            return encodeURIComponent(formatUnicodeStr);
        };
    } catch (error) {
        console.error('Error fetching video stream:', error);
    };
};
import { getHomeVideoStream } from '@/api/home';
import throttle from '@/utils/common/throttle.js';
import { AxiosResponse } from 'axios';
import * as R from 'ramda';
import type { Ref } from 'vue';
interface Segment {
    offset?: number;
    referenceType: number;
    referencedSize: number;
    segmentEndTime: number;
    segmentStartTime: number;
    subsegmentDuration: number;
    start: number;
    end: number;
};

interface StreamInfo {
    SegmentBase: {
        Initialization: string,
        indexRange: string
    };
    backupUrl: string[];
    backup_url: string[];
    bandwidth: number;
    baseUrl: string; 
    base_url: string;
    codecid: number;
    codecs: string;
    frameRate: string;
    frame_rate: string;
    height: number;
    id: number;
    mimeType: string;
    mime_type: string;
    sar: string;
    segment_base: {
        Initialization: string,
        indexRange: string
    };
    startWithSap: number;
    start_with_sap: number;
    width: number;
};

// 定义返回对象的类型
interface VideoControls {
    /**
     * 停止视频播放并移除事件监听器
     * @param playVideo - 一个可选对象，包含一个 `cancel` 方法用于取消视频播放
     */
    stop: (playVideo?: { cancel: () => void }) => void;
  
    /**
     * 开始播放视频
     * @returns 一个 `Promise`，表示视频是否成功播放
     */
    start: () => Promise<void>;
  
    /**
     * 跳转到指定时间播放视频
     * @param time - 需要跳转到的时间（秒）设定最大值为视频结束时间 - 1
     * @returns 一个 `Promise`，表示是否成功跳转
     */
    jump: (time: number) => Promise<void>;
};

// 问题1 handleLoadChunk有时不会调用 解决：在loadChunk函数中加入isLoading标志位防止上一个分片没加载完毕索引信息未更新就加载下一个分片
// 问题2 点击跳转sourceBuffer.appendBuffer后没有真正插入数据 解决：range范围错误, 分片的结尾应该是开头 + referencedSize - 1 由于range是一个闭合区间所以需要 - 1
/**
 * 使用 MSE 加载 dash视频流
 * @param videosStreamInfo 视频流信息
 * @param videoItem 视频实例用于存储信息
 * @param videoRef 视频元素引用
 * @param videoBlobUrls 视频blobUrl数组
 * @param audioStreamInfo 音频流信息
 * @param sessdata cookie
 * @returns {stop, jump, start} 返回控制函数来实现暂停, 跳转, 播放
 */
export default async (
        videosStreamInfo: StreamInfo[], 
        videoItem: Record<string, any>, 
        videoRef: Ref<HTMLMediaElement>, 
        videoBlobUrls: Ref<string[]>, 
        audioStreamInfo : StreamInfo | null = null,
        sessdata?: string,
        currentTime: number = 0
    ): Promise<VideoControls | null> =>  {
    try {
        // 标志视频起始和结束时间
        let segmentsStart: number = 0;
        let segmentsEnd: number = 0;
        let videoLastSegments: Segment[] = [];
        let audioLastSegments: Segment[] | null = [];
        async function main() {
            for(let i = 0; i < videosStreamInfo.length; i++) {
                const mimeCodec = `${videosStreamInfo[i].mimeType}; codecs=${videosStreamInfo[i].codecs}`;

                let audioMimeCodec = '';
                let audioStreamUrl = '';
                let audioInitialization = '';
                let audioIndexRange = '';
                if(audioStreamInfo) {
                    audioMimeCodec = `${audioStreamInfo.mimeType}; codecs=${audioStreamInfo.codecs}`;
                    audioStreamUrl = formatVideoUrl(audioStreamInfo.baseUrl);
                    audioInitialization = audioStreamInfo.SegmentBase.Initialization;
                    audioIndexRange = audioStreamInfo.SegmentBase.indexRange;
                    videoItem.audioLastSegmentIndex = 0;
                    videoItem.audioStartRange = 0;
                };

                // 检查浏览器是否支持该类型编码器
                if(MediaSource.isTypeSupported(mimeCodec)) {
                    const mediaSource = new MediaSource();
                    const videoStreamUrl = formatVideoUrl(videosStreamInfo[i].baseUrl);
                    // 在 DASH 方式下，关键帧信息移到了 sidx box 里
                    const videoInitialization = videosStreamInfo[i].SegmentBase.Initialization;
                    const videoIndexRange = videosStreamInfo[i].SegmentBase.indexRange;

                    // 所有信息存在实例上停止播放不会消失
                    videoItem.mediaSource = mediaSource;
                    // 如果 MediaSource 被关闭（即 mediaSource.readyState 变为 closed 或 ended），它关联的 blob URL 将会失效
                    videoItem.videoSrc = URL.createObjectURL(mediaSource);
                    videoBlobUrls.value.push(videoItem.videoSrc);
                    // 支持编码的格式索引
                    videoItem.videoSupportIndex = i;
                    videoItem.videoLastSegmentIndex = 0;
                    videoItem.videoStartRange = Number(videoIndexRange.split('-')[1]) + 1;
                    mediaSource.addEventListener('sourceopen', sourceOpen);
                    
                    async function sourceOpen() {
                        try {
                            // 创建 SourceBuffer 音视频需要同步同时播放
                            videoItem.videoSourceBuffer = mediaSource.addSourceBuffer(mimeCodec);
                            if(audioStreamInfo) videoItem.audioSourceBuffer = mediaSource.addSourceBuffer(audioMimeCodec);
                            await Promise.all([
                                (async () => {
                                    const arrayBuffer = await fetchVideoArrayBuffer(videoStreamUrl, videoInitialization);
                                    await insertStream(videoRef.value, videoItem.videoSourceBuffer, arrayBuffer);
                                })(),
                                audioStreamInfo ? (async () => {
                                    const arrayBuffer = await fetchVideoArrayBuffer(audioStreamUrl, audioInitialization);
                                    await insertStream(videoRef.value, videoItem.audioSourceBuffer, arrayBuffer);
                                })() : Promise.resolve()
                            ]);

                            [videoLastSegments, audioLastSegments] = await Promise.all([
                                (async () => {
                                    const arrayBuffer = await fetchVideoArrayBuffer(videoStreamUrl, videoIndexRange);
                                    const videoLastSegments = parseSidx(arrayBuffer) || [];
                                    await insertStream(videoRef.value, videoItem.videoSourceBuffer, arrayBuffer);
                                    return videoLastSegments;
                                })(),
                                audioStreamInfo ? (async () => {
                                    const arrayBuffer = await fetchVideoArrayBuffer(audioStreamUrl, audioIndexRange);
                                    const audioLastSegments = parseSidx(arrayBuffer) || [];
                                    await insertStream(videoRef.value, videoItem.audioSourceBuffer, arrayBuffer);
                                    return audioLastSegments;
                                })() : Promise.resolve(null)
                            ]);
                            segmentsStart = videoLastSegments[0].segmentStartTime;
                            segmentsEnd = videoLastSegments[videoLastSegments.length - 1].segmentEndTime;
                            // 标志位防止请求未完成继续执行下一次函数
                            let isLoading = false;
                            videoItem.handleTimeUpdate = throttle(async () => {
                                const during = getSourceBufferDuring(videoItem.videoSourceBuffer);
                                // 定期清理缓冲
                                if (during > 30) {
                                    if (!videoItem.videoSourceBuffer.updating) {
                                        await new Promise(resolve => {
                                            // 删除缓冲区前面的部分，保留当前播放时间之前的5秒
                                            videoItem.videoSourceBuffer.remove(0, videoRef.value.currentTime - 5);
                                            // 等待删除完成
                                            videoItem.videoSourceBuffer.addEventListener('updateend', resolve, { once: true });
                                        });
                                    };
                                };
                                if(isLoading === true) return;
                                isLoading = true;
                                await Promise.all([
                                    loadChunk(videoItem.videoSourceBuffer, videoStreamUrl, videoLastSegments, 'video'),
                                    audioLastSegments ? loadChunk(videoItem.audioSourceBuffer, audioStreamUrl, audioLastSegments, 'audio') : Promise.resolve()
                                ]);
                                isLoading = false;
                            }, 1000);
                            await Promise.all([
                                loadChunk(videoItem.videoSourceBuffer, videoStreamUrl, videoLastSegments, 'video'),
                                audioLastSegments ? loadChunk(videoItem.audioSourceBuffer, audioStreamUrl, audioLastSegments, 'audio') : Promise.resolve()
                            ]);
                            // 切换清晰度时需要重新加载视频
                            if(currentTime) {
                                await jump(currentTime);
                            }
                            else {
                                start();
                            };
                        } catch(err) {
                            console.log('加载失败', err);
                            stop();
                        };
                    };
                    break;
                };
            }; 
        };
        async function loadChunk(sourceBuffer: SourceBuffer, videoStreamUrl: string, lastSegments: Segment[], type: string, isJump: boolean = false) {
            if (!sourceBuffer.updating && videoItem.mediaSource.readyState === 'open' && (shouldLoadNextSegment() || isJump)) {
                let lastSegmentIndex;
                let range = '';
                if(type === 'video') {
                    lastSegmentIndex = videoItem.videoLastSegmentIndex;
                    if(lastSegmentIndex < lastSegments.length) 
                        range = `${videoItem.videoStartRange}-${videoItem.videoStartRange + lastSegments[lastSegmentIndex].referencedSize - 1}`;
                }
                else if(type === 'audio') {
                    lastSegmentIndex = videoItem.audioLastSegmentIndex;
                    if(lastSegmentIndex < lastSegments.length) 
                        range = `${videoItem.audioStartRange}-${videoItem.audioStartRange + lastSegments[lastSegmentIndex].referencedSize - 1}`;
                }
                else return;
                if(lastSegmentIndex < lastSegments.length) {
                    // 加载片段到 SourceBuffer
                    const arrayBuffer = await fetchVideoArrayBuffer(videoStreamUrl, range);
                    await waitSourceBuffer(sourceBuffer);
                    await insertStream(videoRef.value, sourceBuffer, arrayBuffer);
                    handleLoadChunk(lastSegments, type);
                }
                else {
                    // 当所有片段加载完成后，结束流
                    // 无法确定是否会再次播放片段不要调用endOfStream
                    // videoItem.mediaSource.endOfStream();
                    videoRef.value.removeEventListener('timeupdate', videoItem.handleTimeUpdate);
                };
            };
        };
        function handleLoadChunk(lastSegments: Segment[] = [], type: string): void {
            if(type === 'video') {
                videoItem.videoStartRange = videoItem.videoStartRange + lastSegments[videoItem.videoLastSegmentIndex].referencedSize;
                videoItem.videoLastSegmentIndex++;
            }
            else if(type === 'audio') {
                videoItem.audioStartRange = videoItem.audioStartRange + lastSegments[videoItem.audioLastSegmentIndex].referencedSize;
                videoItem.audioLastSegmentIndex++;
            }
            else return;
        };
        function insertStream(mediaElement: HTMLMediaElement ,sourceBuffer: SourceBuffer, arrayBuffer: ArrayBuffer) {
            return new Promise(resolve => {
                try {
                    if (mediaElement.error) {
                        console.error('Media Error:', mediaElement.error);
                        return;
                    };
                    sourceBuffer.addEventListener('error', (event: Event) => {
                        console.error('append err:', event);
                    });
                    sourceBuffer.addEventListener('updateend', function updateListener() {
                        sourceBuffer.removeEventListener('updateend', updateListener);
                        resolve(arrayBuffer);
                    }, { once: true });
                    sourceBuffer.appendBuffer(arrayBuffer);
                } catch(err) {
                    console.log('insert err', err);   
                };
            });
        };
        async function fetchVideoArrayBuffer(videoStreamUrl: string, range: string): Promise<ArrayBuffer> {
            const response: AxiosResponse = await getHomeVideoStream({ videoStreamUrl }, range, sessdata || '');
            const arrayBuffer = response.data;
            return arrayBuffer;
        };
        function parseSidx(buffer: ArrayBuffer): Segment[] | null {
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
                return null;
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
        
                // 计算分片的起始和结束字节范围
                const segmentStartByte = Number(firstOffset) + offset; // 计算分片起始字节
                const segmentEndByte = Number(firstOffset) + offset + referencedSize; // 计算分片结束字节
        
                // 推入 segments 数组
                segments.push({
                    referenceType,
                    referencedSize,
                    subsegmentDuration,
                    segmentStartTime,
                    segmentEndTime,
                    start: segmentStartByte, // 新增起始字节
                    end: segmentEndByte,      // 新增结束字节
                });
        
                // 更新 earliestPresentationTime
                earliestPresentationTime = BigInt(earliestPresentationTime) + BigInt(subsegmentDuration);
            }
        
            return segments;
        }
        function shouldLoadNextSegment() {
            const currentTime = videoRef.value.currentTime;
            const buffered = videoRef.value.buffered;
            if(buffered.length === 0) return true;
            // 检查当前时间与已缓冲区域的差距
            for (let i = 0; i < buffered.length; i++) {
                // console.log(buffered.start(i) + ' &&&& ' + buffered.end(i) + '&&&&' + currentTime);
                if (currentTime >= buffered.start(i) && currentTime < buffered.end(i)) {
                    // 如果当前播放位置距离缓冲区域尾端不足 30 秒，开始加载下一段
                    if (buffered.end(i) - currentTime < 30) {
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
        // 确保SourceBuffer处于非更新状态
        function waitSourceBuffer(sourceBuffer: SourceBuffer) {
            return new Promise<void>((resolve) => {
                if (!sourceBuffer.updating) {
                    resolve();
                } else {
                    sourceBuffer.addEventListener('updateend', () => resolve(), { once: true });
                }
            });
        };
        // 清空全部缓冲区
        function clearSourceBuffer(sourceBuffer: SourceBuffer) {
            return new Promise<void>((resolve) => {
                const buffered = sourceBuffer.buffered;
                if (buffered.length > 0) {
                    const start = buffered.start(0);
                    const end = buffered.end(buffered.length - 1);
                    // 不会清除关键元数据
                    sourceBuffer.remove(start, end);
                    // 完成删除后退出
                    sourceBuffer.addEventListener('updateend', () => resolve(), { once: true });
                } else {
                    resolve();
                };
            });
        };
        // 获取播放进度前的缓存长度
        function getSourceBufferDuring(sourceBuffer: SourceBuffer) {
            const buffered = sourceBuffer.buffered;
            let totalBuffered = 0;
            for (let i = 0; i < buffered.length; i++) {
                if(buffered.end(i) > videoRef.value.currentTime) totalBuffered += videoRef.value.currentTime - buffered.start(i);
                else totalBuffered += buffered.end(i) - buffered.start(i);
            };
            return totalBuffered;
        };
        const stop = (playVideo?: {cancel: () => void}) => {
            try {
                if(playVideo) {
                    playVideo.cancel();
                };
                if (videoRef) {
                    videoRef.value.removeEventListener('timeupdate', videoItem.handleTimeUpdate);
                    videoRef.value.pause();
                };
                return;
            } catch(err) {
                console.log('停止失败', err);
            };
        };
        const start = async () => {
            try {
                videoRef.value.removeEventListener('timeupdate', videoItem.handleTimeUpdate);
                videoRef.value.addEventListener('timeupdate', videoItem.handleTimeUpdate);
                await videoRef.value.play();
            } catch(err) {
                console.log('播放失败', err);
            };
        };
        const jump = async (time: number) => {
            try {
                stop();
                if(videoItem.mediaSource.readyState === 'open') {
                    videoItem.videoSourceBuffer.abort();
                    if(audioStreamInfo) videoItem.audioSourceBuffer.abort();
                }
                else {
                    return;
                };

                if(time < segmentsStart) {
                    time = segmentsStart;
                } 
                else if(time > segmentsEnd - 1) {
                    time = segmentsEnd - 1;
                };
                let audioStreamUrl = '';
                let audioIndexRange = '';
                if(audioStreamInfo) {
                    audioStreamUrl = formatVideoUrl(audioStreamInfo.baseUrl);
                    audioIndexRange = audioStreamInfo.SegmentBase.indexRange;
                };

                const videoStreamUrl = formatVideoUrl(videosStreamInfo[videoItem.videoSupportIndex].baseUrl);
                const videoIndexRange = videosStreamInfo[videoItem.videoSupportIndex].SegmentBase.indexRange;
                // 第一个分片的起始位置
                const firstVideoSegmentStart = Number(videoIndexRange.split('-')[1]) + 1;
                const firstAudioSegmentStart = Number(audioIndexRange.split('-')[1]) + 1;
                await Promise.all([
                    waitSourceBuffer(videoItem.videoSourceBuffer),
                    audioStreamInfo ? waitSourceBuffer(videoItem.audioSourceBuffer) : Promise.resolve()
                ]);
            
                await Promise.all([
                    clearSourceBuffer(videoItem.videoSourceBuffer),
                    audioStreamInfo ? clearSourceBuffer(videoItem.audioSourceBuffer) : Promise.resolve()
                ]);

                const selectStartSegment = (index: number) => {
                    return R.slice(0, index);
                };
                /**
                 * 
                 * @param initialValue 初始值
                 * @returns 累加器函数 需要传入全部分片并再次调用
                 */
                const selectStartRange = (initialValue: number) => R.reduce((acc: number, segment: Segment) => acc + segment.referencedSize, initialValue);

                const selectIndex = R.findIndex((segment: Segment) => {
                    if(segment.segmentStartTime <= time && time <= segment.segmentEndTime) {
                        return true;
                    };
                    return false;
                });
    
                const selectInfo = (segments: Segment[], firstVideoSegmentStart: number) => {
                    const selectedIndex: number = selectIndex(segments);
                    // 累加到选中片段前一个片段的总和
                    const selectedStartSegments: Segment[] = selectedIndex > 0 ? selectStartSegment(selectedIndex)(segments) : [];
                    // 选中片段的开始位置
                    const selectedStartRange: number = selectStartRange(firstVideoSegmentStart)(selectedStartSegments);
                    return { 
                        selectedIndex,
                        selectedStartRange
                    };
                };
                const updateItemVideo = () => {
                    const { selectedIndex, selectedStartRange } = selectInfo(videoLastSegments, firstVideoSegmentStart);
                    videoItem.videoStartRange = selectedStartRange;
                    videoItem.videoLastSegmentIndex = selectedIndex; 
                };
                const updateItemAudio = () => {
                    if(audioLastSegments) {
                        const { selectedIndex, selectedStartRange } = selectInfo(audioLastSegments, firstAudioSegmentStart);
                        videoItem.audioStartRange = selectedStartRange;
                        videoItem.audioLastSegmentIndex = selectedIndex;
                    };
                };
                updateItemVideo();
                updateItemAudio();

                await Promise.all([
                    waitSourceBuffer(videoItem.videoSourceBuffer),
                    audioStreamInfo ? waitSourceBuffer(videoItem.audioSourceBuffer) : Promise.resolve()
                ]);

                await Promise.all([
                    loadChunk(videoItem.videoSourceBuffer, videoStreamUrl, videoLastSegments, 'video', true),
                    audioLastSegments ? loadChunk(videoItem.audioSourceBuffer, audioStreamUrl, audioLastSegments, 'audio', true) : Promise.resolve()
                ]);
                // 设置当前时间
                videoRef.value.currentTime = time;
                await start();
                return;
            } catch(err) {
                console.log('跳转失败', err);
            };
        };
        
        await main();
        return { stop, jump, start };
    } catch (error) {
        console.error('Error fetching video stream:', error);
        return null;
    };
};
<template>
    <div>
        <section class="content-hot">
            <div v-for="(item, index) in popularVideos" :key="item.aid" class="cards-content" @click="handleClickVideo(item, index)">
                <div class="box-card flex-column-center">
                    <div class="card-content mb-10">
                        <div class="card-cover">
                            <img alt="" class="img" v-lazyload="`${item.pic}@412w_232h_1c_!web-popular.avif`" />
                            <div class="card-mask">
                                <div class="card-mask-info flex-between">
                                    <div class="card-mask-info-left flex-start">
                                        <span class="mr-12 flex-center">
                                            <svg xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink" viewBox="0 0 24 24" width="24" height="24" fill="#ffffff" class="card-mask-icon mr-3">
                                                <path d="M12 4.99805C9.48178 4.99805 7.283 5.12616 5.73089 5.25202C4.65221 5.33949 3.81611 6.16352 3.72 7.23254C3.60607 8.4998 3.5 10.171 3.5 11.998C3.5 13.8251 3.60607 15.4963 3.72 16.76355C3.81611 17.83255 4.65221 18.6566 5.73089 18.7441C7.283 18.8699 9.48178 18.998 12 18.998C14.5185 18.998 16.7174 18.8699 18.2696 18.74405C19.3481 18.65655 20.184 17.8328 20.2801 16.76405C20.394 15.4973 20.5 13.82645 20.5 11.998C20.5 10.16965 20.394 8.49877 20.2801 7.23205C20.184 6.1633 19.3481 5.33952 18.2696 5.25205C16.7174 5.12618 14.5185 4.99805 12 4.99805zM5.60965 3.75693C7.19232 3.62859 9.43258 3.49805 12 3.49805C14.5677 3.49805 16.8081 3.62861 18.3908 3.75696C20.1881 3.90272 21.6118 5.29278 21.7741 7.09773C21.8909 8.3969 22 10.11405 22 11.998C22 13.88205 21.8909 15.5992 21.7741 16.8984C21.6118 18.7033 20.1881 20.09335 18.3908 20.23915C16.8081 20.3675 14.5677 20.498 12 20.498C9.43258 20.498 7.19232 20.3675 5.60965 20.2392C3.81206 20.0934 2.38831 18.70295 2.22603 16.8979C2.10918 15.5982 2 13.8808 2 11.998C2 10.1153 2.10918 8.39787 2.22603 7.09823C2.38831 5.29312 3.81206 3.90269 5.60965 3.75693z" fill="currentColor"></path><path d="M14.7138 10.96875C15.50765 11.4271 15.50765 12.573 14.71375 13.0313L11.5362 14.8659C10.74235 15.3242 9.75 14.7513 9.75001 13.8346L9.75001 10.1655C9.75001 9.24881 10.74235 8.67587 11.5362 9.13422L14.7138 10.96875z" fill="currentColor">
                                                </path>
                                            </svg>
                                            <span>{{formatView(item.stat.view)}}</span>
                                        </span>
                                        <span class="flex-center">
                                            <svg xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink" viewBox="0 0 24 24" width="24" height="24" fill="#ffffff" class="card-mask-icon mr-3">
                                                <path d="M12 4.99805C9.48178 4.99805 7.283 5.12616 5.73089 5.25202C4.65221 5.33949 3.81611 6.16352 3.72 7.23254C3.60607 8.4998 3.5 10.171 3.5 11.998C3.5 13.8251 3.60607 15.4963 3.72 16.76355C3.81611 17.83255 4.65221 18.6566 5.73089 18.7441C7.283 18.8699 9.48178 18.998 12 18.998C14.5185 18.998 16.7174 18.8699 18.2696 18.74405C19.3481 18.65655 20.184 17.8328 20.2801 16.76405C20.394 15.4973 20.5 13.82645 20.5 11.998C20.5 10.16965 20.394 8.49877 20.2801 7.23205C20.184 6.1633 19.3481 5.33952 18.2696 5.25205C16.7174 5.12618 14.5185 4.99805 12 4.99805zM5.60965 3.75693C7.19232 3.62859 9.43258 3.49805 12 3.49805C14.5677 3.49805 16.8081 3.62861 18.3908 3.75696C20.1881 3.90272 21.6118 5.29278 21.7741 7.09773C21.8909 8.3969 22 10.11405 22 11.998C22 13.88205 21.8909 15.5992 21.7741 16.8984C21.6118 18.7033 20.1881 20.09335 18.3908 20.23915C16.8081 20.3675 14.5677 20.498 12 20.498C9.43258 20.498 7.19232 20.3675 5.60965 20.2392C3.81206 20.0934 2.38831 18.70295 2.22603 16.8979C2.10918 15.5982 2 13.8808 2 11.998C2 10.1153 2.10918 8.39787 2.22603 7.09823C2.38831 5.29312 3.81206 3.90269 5.60965 3.75693z" fill="currentColor"></path><path d="M15.875 10.75L9.875 10.75C9.46079 10.75 9.125 10.4142 9.125 10C9.125 9.58579 9.46079 9.25 9.875 9.25L15.875 9.25C16.2892 9.25 16.625 9.58579 16.625 10C16.625 10.4142 16.2892 10.75 15.875 10.75z" fill="currentColor">
                                                </path>
                                                <path d="M17.375 14.75L11.375 14.75C10.9608 14.75 10.625 14.4142 10.625 14C10.625 13.5858 10.9608 13.25 11.375 13.25L17.375 13.25C17.7892 13.25 18.125 13.5858 18.125 14C18.125 14.4142 17.7892 14.75 17.375 14.75z" fill="currentColor"></path><path d="M7.875 10C7.875 10.4142 7.53921 10.75 7.125 10.75L6.625 10.75C6.21079 10.75 5.875 10.4142 5.875 10C5.875 9.58579 6.21079 9.25 6.625 9.25L7.125 9.25C7.53921 9.25 7.875 9.58579 7.875 10z" fill="currentColor"></path><path d="M9.375 14C9.375 14.4142 9.03921 14.75 8.625 14.75L8.125 14.75C7.71079 14.75 7.375 14.4142 7.375 14C7.375 13.5858 7.71079 13.25 8.125 13.25L8.625 13.25C9.03921 13.25 9.375 13.5858 9.375 14z" fill="currentColor">
                                                </path>
                                            </svg>
                                            <span>{{item.stat.danmaku}}</span>
                                        </span>
                                    </div>
                                    <div class="card-mask-info-right">{{formatSeconds(item.duration)}}</div>
                                </div>
                            </div>
                        </div>
                        <div class="card-inline-player" :class="curMouseIndex === index ? '' : 'invisible'" @mouseenter="handleMouseEnter(item, index)" @mouseleave="handleMouseLeave(item, index)">
                            <div class="card-player-area">
                                <div class="card-video-wrap">
                                    <video :src="item.videoSrc ? item.videoSrc : ''" ref="videoRefs" preload="auto" crossorigin="anonymous"></video>
                                </div>
                            </div>
                        </div>
                    </div>
                    <div class="card-info">
                        <div class="card-title mb-10 flex-between">
                            <span>{{ item.title }}</span>
                        </div>
                        <div class="card-info-bottom flex-start">
                            <div class="card-info-owner flex-start">
                                <svg
                                    xmlns="http://www.w3.org/2000/svg"
                                    xmlns:xlink="http://www.w3.org/1999/xlink"
                                    viewBox="0 0 24 24"
                                    width="24"
                                    height="24"
                                    fill="currentColor"
                                    class="card-svg mr-5"
                                >
                                    <path
                                        d="M6.15 8.24805C6.5642 8.24805 6.9 8.58383 6.9 8.99805L6.9 12.7741C6.9 13.5881 7.55988 14.248 8.3739 14.248C9.18791 14.248 9.8478 13.5881 9.8478 12.7741L9.8478 8.99805C9.8478 8.58383 10.1836 8.24805 10.5978 8.24805C11.012 8.24805 11.3478 8.58383 11.3478 8.99805L11.3478 12.7741C11.3478 14.41655 10.01635 15.748 8.3739 15.748C6.73146 15.748 5.4 14.41655 5.4 12.7741L5.4 8.99805C5.4 8.58383 5.73578 8.24805 6.15 8.24805z"
                                        fill="currentColor"
                                    ></path>
                                    <path
                                        d="M12.6522 8.99805C12.6522 8.58383 12.98795 8.24805 13.4022 8.24805L15.725 8.24805C17.31285 8.24805 18.6 9.53522 18.6 11.123C18.6 12.71085 17.31285 13.998 15.725 13.998L14.1522 13.998L14.1522 14.998C14.1522 15.4122 13.8164 15.748 13.4022 15.748C12.98795 15.748 12.6522 15.4122 12.6522 14.998L12.6522 8.99805zM14.1522 12.498L15.725 12.498C16.4844 12.498 17.1 11.8824 17.1 11.123C17.1 10.36365 16.4844 9.74804 15.725 9.74804L14.1522 9.74804L14.1522 12.498z"
                                        fill="currentColor"
                                    ></path>
                                    <path
                                        d="M12 4.99805C9.48178 4.99805 7.283 5.12616 5.73089 5.25202C4.65221 5.33949 3.81611 6.16352 3.72 7.23254C3.60607 8.4998 3.5 10.171 3.5 11.998C3.5 13.8251 3.60607 15.4963 3.72 16.76355C3.81611 17.83255 4.65221 18.6566 5.73089 18.7441C7.283 18.8699 9.48178 18.998 12 18.998C14.5185 18.998 16.7174 18.8699 18.2696 18.74405C19.3481 18.65655 20.184 17.8328 20.2801 16.76405C20.394 15.4973 20.5 13.82645 20.5 11.998C20.5 10.16965 20.394 8.49877 20.2801 7.23205C20.184 6.1633 19.3481 5.33952 18.2696 5.25205C16.7174 5.12618 14.5185 4.99805 12 4.99805zM5.60965 3.75693C7.19232 3.62859 9.43258 3.49805 12 3.49805C14.5677 3.49805 16.8081 3.62861 18.3908 3.75696C20.1881 3.90272 21.6118 5.29278 21.7741 7.09773C21.8909 8.3969 22 10.11405 22 11.998C22 13.88205 21.8909 15.5992 21.7741 16.8984C21.6118 18.7033 20.1881 20.09335 18.3908 20.23915C16.8081 20.3675 14.5677 20.498 12 20.498C9.43258 20.498 7.19232 20.3675 5.60965 20.2392C3.81206 20.0934 2.38831 18.70295 2.22603 16.8979C2.10918 15.5982 2 13.8808 2 11.998C2 10.1153 2.10918 8.39787 2.22603 7.09823C2.38831 5.29312 3.81206 3.90269 5.60965 3.75693z"
                                        fill="currentColor"
                                    ></path>
                                </svg>
                                <span class="card-info-bottom-author">{{ item.owner.name }} · {{ formatTime(item.pubdate) }}</span>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </section>
        <div class="skeleton-wrap" style="--cover-radio: 56.25%;" v-show="isLoading">
            <div class="box-card-skeleton" v-for="index in Array.from({ length: pageCount }) as number[]" :key="index">
                <div class="card-skeleton-cover"></div>
                <div class="card-skeleton-info">
                    <p class="card-skeleton-text"></p>
                    <p class="card-skeleton-text short"></p>
                    <p class="card-skeleton-text-light"></p>
                </div>
            </div>
        </div>
        <div class="no-more text-[12]">已经到底啦</div>
        <div id="sentinel"></div>
    </div>
</template>

<script setup lang="ts">
    import { ref, onActivated, onDeactivated, nextTick } from 'vue';
    import { useRoute } from 'vue-router';
    import { useStore } from 'vuex';
    import * as R from 'ramda';
    import debounce from '@/utils/common/debounce';
    import fetchVideoStream from '@/utils/videoStreamPreview';
    import observeLastEle from '@/utils/observer';
    import stopPreview from '@/utils/stopPreview';
    import {
        formatView,
        formatSeconds,
        formatTime
    } from '@/utils/videoFormatInfo';
    import { getHomePopular } from '@/api/home/hot';
    import { getHomePlayUrl } from '@/api/home';

    interface PopularVideoItem {
        aid: number;
        bvid: string;
        cid: number;
        duration: number;
        pic: string;
        stat: {
            view: number,
            danmaku: number,
            reply: number,
            favorite: number
        };
        owner: {
            face: string,
            mid: number,
            name: string
        };
        pubdate: number;
        title: string;
        videoSrc?: string;
        mediaSource?: MediaSource | null;
        sourceBuffer?: SourceBuffer | null;
    }

    interface VideoDashItem {
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
    }

    const emit = defineEmits(['checkIsNewVideo']);

    const store = useStore();
    const sessdata = store.state.userModule.sessdata;

    const route = useRoute();

    const isLoading = ref(false);
    const maxVideoNum = 30;
    const curMouseIndex = ref<number>(-1);
    const videoBlobUrls = ref<string[]>([]);
    const videoRefs = ref<HTMLVideoElement[]>([]);
    const popularVideos = ref<PopularVideoItem[]>([]);
    const freshIdx = ref(1);
    const isNoMore = ref(false);
    const pageCount = 20;
    const fetchPopularVideos = debounce(async ({ sessdata, pn = 1, ps = 20 }: { sessdata: string; pn?: number; ps?: number }) => {
        if (!isNoMore.value) {
            const response = await getHomePopular({ pn, ps }, sessdata);
            const successAction = R.pipe(
                R.path(['data']),
                R.tap((resData: any) => (isNoMore.value = resData.no_more)),
                R.pathOr([], ['list']),
                R.concat(popularVideos.value),
                R.tap((newPopularVideos: PopularVideoItem[]) => (popularVideos.value = newPopularVideos)),
                R.tap(() => (isNoMore.value = isNoMore.value || popularVideos.value.length >= maxVideoNum)),
                () => {
                    freshIdx.value++;
                }
            );

            const failAction = R.pipe(
                R.pathOr('', ['message']),
                R.when(
                    (message: string) => message !== '' && message !== 'undefined',
                    ElMessage.error
                )
            );

            R.ifElse(
                R.propEq(0, 'code'),
                successAction,
                failAction
            )(R.path(['data'], response));
        };
    });
    const triggerFetchPopularRecommand = async (...args: Parameters<typeof fetchPopularVideos>) => {
        try {
            if(isNoMore.value) return;
            isLoading.value = true;
            await fetchPopularVideos(...args);
        } finally {
            isLoading.value = false;
        };
    };
    const fetchHomePopularPlayurl = async (item: PopularVideoItem, sessdata: string): Promise<VideoDashItem[] | null> => {
        const { bvid, cid } = item;
        const response = await getHomePlayUrl({ bvid, cid, fnval: 16 }, sessdata);

        const successAction = R.pipe(
            R.path(['data', 'dash', 'video']) as (data: any) => VideoDashItem[],
            R.filter(R.propEq(32, 'id'))
        );
        return R.ifElse(
            R.propEq(0, 'code'),
            successAction,
            () => null
        )(R.path(['data'], response));
    };

    const playVideo = debounce(async (item: PopularVideoItem, index: number) => {
        const videosStreamInfo = await fetchHomePopularPlayurl(item, sessdata);
        if(!videosStreamInfo) return;
        await fetchVideoStream(videosStreamInfo, index, popularVideos.value[index], videoRefs, videoBlobUrls, curMouseIndex);
    });

    // 停止视频预览播放
    const stopPlayPreview = (item: PopularVideoItem, index: number): void => {
        const videoRef = R.pathOr(null, [index], videoRefs.value);
        if (!videoRef) return;
        stopPreview(item, videoRef, playVideo, curMouseIndex);
    };
    let curPlayerWindowIndex = ref<number>(-1);
    const updateCurPlayerWindowIndex = (index: number): void => {
        curPlayerWindowIndex.value = index;
    };


    const checkIsNewVideo = (callback: (isNew: boolean) => unknown, index: number, routePath: string): void => {
        emit('checkIsNewVideo', callback, index, routePath);
    };

    const openPlayerWindow = (videoItem: PopularVideoItem, index: number, routePath: string): void => {
        const { aid, bvid } = videoItem;
        const jsonData = JSON.stringify({ aid, bvid, windowId: 'video' });
        const callback = (isNew: boolean) => {
            if (isNew) {
                window.electronAPI.sendMessage('player_create', jsonData);
            }
            else {
                window.electronAPI.sendMessage('player_focus', jsonData);
            };
            updateCurPlayerWindowIndex(index);
            stopPlayPreview(videoItem, index);
        };
        checkIsNewVideo(callback, index, routePath);
    };

    const handleClickVideo = (videoItem: PopularVideoItem, index: number) => {
        openPlayerWindow(videoItem, index, route.path);
        updateCurPlayerWindowIndex(index);
        stopPlayPreview(videoItem, index);
    };

    const handleMouseEnter = async (item: PopularVideoItem, index: number) => {
        if(curMouseIndex.value == index) return;
        curMouseIndex.value = index;
        playVideo(item, index);
    };

    const handleMouseLeave = (item: PopularVideoItem, index: number) => {
        stopPlayPreview(item, index);
    };

    const resetVideos = (videos: PopularVideoItem[]): PopularVideoItem[] => {
        return videos.map((video) => {
            video.videoSrc = '';
            video.mediaSource = null;
            video.sourceBuffer = null;
            return video;
        });
    };

    let observer: IntersectionObserver | null = null;

    onActivated(async () => {
        await triggerFetchPopularRecommand({ sessdata });
        await nextTick();
        const sentinel = document.getElementById('sentinel');
        if (sentinel) {
            observer = observeLastEle(sentinel, {}, () => triggerFetchPopularRecommand({ sessdata, pn: freshIdx.value }));
        };
    });

    onDeactivated(() => {
        videoBlobUrls.value.forEach((url) => URL.revokeObjectURL(url));
        if (observer) observer.disconnect();
        popularVideos.value = resetVideos(popularVideos.value);
    });
</script>

<style lang="scss" scoped>
    $topDistance: 90px;
    $brandPink: var(--brand-pink);
    @media (min-width: 2000px) {
        .content-hot {
            --title-font-size: 16px;
            --title-line-height: 24px;
            --subtitle-font-size: 14px;
            --subtitle-line-height: 19px;
            --info-margin-top: 12px;
            --avatar-size: 40px;
            --avatar-margin-right: 12px;
            --icon-size: 20px;
            --title-padding-right: 24px;
        }
    }
    @media (min-width: 1500px) {
    // (1500 - 70 - 40 * 2 - 20 * 4) / 5
        .content-hot, .skeleton-wrap  {
            grid-template-columns: minmax(240px, 1fr) minmax(240px, 1fr) minmax(240px, 1fr) minmax(240px, 1fr) minmax(240px, 1fr);
        }
    }
    // min值必须比 min-width 的 二分之一要小 因为有margin

    @media (max-width: 1500px) {
    // (1000 - 70 - 40 * 2 - 20 * 3) / 4
        .content-hot, .skeleton-wrap{
            grid-template-columns: minmax(180px, 1fr) minmax(180px, 1fr) minmax(180px, 1fr) minmax(180px, 1fr);
        }
    }
    .content-hot {
        display: grid;
        grid-gap: 30px 20px;
        margin-bottom: 20px;
        --title-font-size: 15px;
        --title-line-height: 22px;
        --subtitle-font-size: 13px;
        --subtitle-line-height: 17px;
        --info-margin-top: 8px;
        --avatar-size: 36px;
        --avatar-margin-right: 8px;
        --icon-size: 18px;
        --title-padding-right: 16px;
        --follow-icon-font-size: 12px;
        --follow-icon-line-height: 17px;
        .cards-header {
            position: absolute;
            right: 0;
            top: 0;
            width: 450px;
            height: $topDistance;
            .tip-header {
                color: #666;
            }
            .series-header {
                .current-period {
                    padding: 5px 15px;
                    color: #000;
                    background-color: #fff;
                    border-radius: 5px;
                    height: 100%;
                    box-shadow: 2px #666;
                    transition: .2s;
                    border: 1px solid #ccc;
                    &:hover {
                        opacity: .8;
                        background-color: #eee;
                        img {
                            transform: rotate(180deg);
                        }
                    }
                    img {
                        width: 15px;
                        height: 15px;
                        transition: .5s;
                    }
                }
                .current-period-dark {
                    background-color: #333;
                    color: #fefefe;
                    border: none;
                    &:hover {
                        background-color: #666;
                    }
                }
                .play-btn {
                    padding: 5px 15px;
                    color: #fff;
                    border-radius: 5px;
                    background-color: var(--brand-pink);
                    height: 100%;
                    transition: .2s;
                    &:hover {
                        background-color: rgba(255, 102, 153, .5);
                    }
                    img {
                        width: 15px;
                        height: 15px;
                    }
                }
            }
        }
        .cards-content {
            box-sizing: border-box;
            .box-card {
                width: 100%;
                .card-content {
                    position: relative;
                    width: 100%;
                    aspect-ratio: 38 / 21;
                    border-radius: 5px;
                    overflow: hidden;
                    transition: 0.2s;
                    &:hover {
                        transform: scale(1.05);
                    }
                    .card-cover {
                        width: 100%;
                        height: 100%;
                        z-index: 1;
                        img {
                            width: 100%;
                            height: 100%;
                        }
                        .card-mask {
                            position: absolute;
                            left: 0;
                            top: 0;
                            width: 100%;
                            height: 100%;
                            .card-mask-info {
                                position: absolute;
                                bottom: 0;
                                left: 0;
                                padding: 14px 8px 6px;
                                height: 38px;
                                width: 100%;
                                box-sizing: border-box;
                                background-image: linear-gradient(180deg, rgba(0, 0, 0, 0) 0%, rgba(0, 0, 0, .8) 100%);
                                color: #fff;
                                font-size: var(--subtitle-font-size);
                                line-height: var(--icon-size);
                                .card-mask-info-left {
                                    .card-mask-icon {
                                        width: var(--icon-size);
                                        height: var(--icon-size);
                                    }
                                }
                            }
                        }
                    }

                    .card-inline-player {
                        position: absolute;
                        left: 0;
                        top: 0;
                        z-index: 2;
                        width: 100%;
                        height: 100%;
                        .card-player-area {
                            width: 100%;
                            height: 100%;
                            background-color: #000;
                            .card-video-wrap {
                                width: 100%;
                                height: 100%;
                                color: #fff;
                                video {
                                    width: 100%;
                                    height: 100%;
                                }
                            }
                        } 
                    }
                    .invisible {
                        opacity: 0;
                    }
                }
                .card-info {
                    width: 100%;
                    .card-title {
                        transition: .2s;
                        display: -webkit-box;
                        -webkit-box-orient: vertical; /* 垂直排列 */
                        overflow: hidden; /* 隐藏超出部分 */
                        text-overflow: ellipsis; /* 使用省略号表示超出部分 */
                        -webkit-line-clamp: 2; /* 限制行数，根据需要调整 */
                        height: calc(2 * var(--title-line-height));
                        line-height: var(--title-line-height);
                        color: var(--theme-text-color);
                        font-size: var(--title-font-size);
                        &:hover {
                            color: var(--brand-pink);
                        }
                    }
                    .card-info-bottom {
                        .card-info-owner {
                            transition: .2s;
                            font-size: var(--subtitle-font-size);
                            color: var(--theme-subtitle-color);
                            &:hover {
                                color: var(--brand-pink);
                            }
                            .card-svg {
                                width: var(--subtitle-line-height);
                                height: var(--subtitle-line-height);
                            }
                            .card-info-bottom-text {
                                color: #FF7F24;
                                background-color: var(--video-card-reason);
                                padding: 0 4px;
                                margin-right: 4px;
                                border-radius: 3px;
                                font-size: var(--follow-icon-font-size);
                                line-height: var(--follow-icon-line-height);
                            }
                            .card-info-bottom-author {
                                line-height: var(--subtitle-line-height);
                            }
                        }

                    }
                }

            }
        }
    }
    .skeleton-wrap {
        display: grid;
        grid-gap: 30px 20px;
        margin-bottom: 20px;
        .box-card-skeleton {
            pointer-events: none;
            user-select: none;
            width: 100%;
            height: 100%;
            .card-skeleton-cover {
                padding-top: var(--cover-radio);
                background: linear-gradient(-45deg, var(--graph_bg_regular) 25%, var(--bg1) 45%, var(--graph_bg_regular) 65%);
                background-size: 400% 100%;
                animation: skeleton-loading 1.2s ease-in-out infinite;
                border-radius: 5px;
            }
            @keyframes skeleton-loading {
                0% {
                    background-position: 100% 50%;
                }
                100% {
                    background-position: 0 50%;
                }                        
            }
            .card-skeleton-info {
                margin-top: var(--info-margin-top);
                .card-skeleton-text {
                    margin-bottom: 4px;
                    width: 94%;
                    height: calc(var(--title-line-height) - 4px);
                    border-radius: 4px;
                    background-color: var(--graph_bg_regular);
                }
                .short {
                    width: 74%;
                }
                .card-skeleton-text-light {
                    margin-top: 8px;
                    width: 50%;
                    height: var(--subtitle-line-height);
                    border-radius: 4px;
                    background-color: var(--graph_bg_regular);
                }
            }
        }
    }
    .no-more {
        width: 100%;
        text-align: center;
        line-height: 50px;
        color: #666;
    }
    #sentinel {
        height: 1px;
        width: 100%;
    }
</style>
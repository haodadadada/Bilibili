<template>
    <div class="container-search">
        <div ref="contentRef">
            <div class="order-search">
                <span 
                    v-for="item of orderBtnList" 
                    :key="item.index" 
                    class="order-btn" 
                    :class="{'order-btn-active': curOrderIndex === item.index}"
                    @click="handleClickTabOrderBtn(item.index)"
                >
                    {{ item.text }}
                </span>
            </div>
            <section class="content-search">
                <div class="content-wrap" v-if="searchVideos.length > 0 && !isLoading">
                    <template v-for="(item, index) in searchFilterVideos" :key="item.id" >
                        <div class="box-card" @click="openPlayerWindow(item, index)" v-if="item && item.id !== 0 && item.type == 'video'">
                            <div class="box-card-wrap flex-column-center">
                                <div class="card-content">
                                    <div class="card-cover">
                                        <div class="img-wrap">
                                            <img alt="" class="img" v-lazyload="`${item.pic}@672w_378h_1c.avif`" crossorigin="anonymous" onerror="this.style.display='none'"/>
                                        </div>
                                        <div class="card-mask">
                                            <div class="card-mask-info flex-between">
                                                <div class="card-mask-info-left flex-start">
                                                    <span class="mr-12 flex-center">
                                                        <svg xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink" viewBox="0 0 24 24" width="24" height="24" fill="#ffffff" class="card-mask-icon mr-3">
                                                            <path d="M12 4.99805C9.48178 4.99805 7.283 5.12616 5.73089 5.25202C4.65221 5.33949 3.81611 6.16352 3.72 7.23254C3.60607 8.4998 3.5 10.171 3.5 11.998C3.5 13.8251 3.60607 15.4963 3.72 16.76355C3.81611 17.83255 4.65221 18.6566 5.73089 18.7441C7.283 18.8699 9.48178 18.998 12 18.998C14.5185 18.998 16.7174 18.8699 18.2696 18.74405C19.3481 18.65655 20.184 17.8328 20.2801 16.76405C20.394 15.4973 20.5 13.82645 20.5 11.998C20.5 10.16965 20.394 8.49877 20.2801 7.23205C20.184 6.1633 19.3481 5.33952 18.2696 5.25205C16.7174 5.12618 14.5185 4.99805 12 4.99805zM5.60965 3.75693C7.19232 3.62859 9.43258 3.49805 12 3.49805C14.5677 3.49805 16.8081 3.62861 18.3908 3.75696C20.1881 3.90272 21.6118 5.29278 21.7741 7.09773C21.8909 8.3969 22 10.11405 22 11.998C22 13.88205 21.8909 15.5992 21.7741 16.8984C21.6118 18.7033 20.1881 20.09335 18.3908 20.23915C16.8081 20.3675 14.5677 20.498 12 20.498C9.43258 20.498 7.19232 20.3675 5.60965 20.2392C3.81206 20.0934 2.38831 18.70295 2.22603 16.8979C2.10918 15.5982 2 13.8808 2 11.998C2 10.1153 2.10918 8.39787 2.22603 7.09823C2.38831 5.29312 3.81206 3.90269 5.60965 3.75693z" fill="currentColor"></path><path d="M14.7138 10.96875C15.50765 11.4271 15.50765 12.573 14.71375 13.0313L11.5362 14.8659C10.74235 15.3242 9.75 14.7513 9.75001 13.8346L9.75001 10.1655C9.75001 9.24881 10.74235 8.67587 11.5362 9.13422L14.7138 10.96875z" fill="currentColor">
                                                            </path>
                                                        </svg>
                                                        <span>{{ formatView(item.play) }}</span>
                                                    </span>
                                                    <span class="flex-center">
                                                        <svg xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink" viewBox="0 0 24 24" width="24" height="24" fill="#ffffff" class="card-mask-icon mr-3">
                                                            <path d="M12 4.99805C9.48178 4.99805 7.283 5.12616 5.73089 5.25202C4.65221 5.33949 3.81611 6.16352 3.72 7.23254C3.60607 8.4998 3.5 10.171 3.5 11.998C3.5 13.8251 3.60607 15.4963 3.72 16.76355C3.81611 17.83255 4.65221 18.6566 5.73089 18.7441C7.283 18.8699 9.48178 18.998 12 18.998C14.5185 18.998 16.7174 18.8699 18.2696 18.74405C19.3481 18.65655 20.184 17.8328 20.2801 16.76405C20.394 15.4973 20.5 13.82645 20.5 11.998C20.5 10.16965 20.394 8.49877 20.2801 7.23205C20.184 6.1633 19.3481 5.33952 18.2696 5.25205C16.7174 5.12618 14.5185 4.99805 12 4.99805zM5.60965 3.75693C7.19232 3.62859 9.43258 3.49805 12 3.49805C14.5677 3.49805 16.8081 3.62861 18.3908 3.75696C20.1881 3.90272 21.6118 5.29278 21.7741 7.09773C21.8909 8.3969 22 10.11405 22 11.998C22 13.88205 21.8909 15.5992 21.7741 16.8984C21.6118 18.7033 20.1881 20.09335 18.3908 20.23915C16.8081 20.3675 14.5677 20.498 12 20.498C9.43258 20.498 7.19232 20.3675 5.60965 20.2392C3.81206 20.0934 2.38831 18.70295 2.22603 16.8979C2.10918 15.5982 2 13.8808 2 11.998C2 10.1153 2.10918 8.39787 2.22603 7.09823C2.38831 5.29312 3.81206 3.90269 5.60965 3.75693z" fill="currentColor"></path><path d="M15.875 10.75L9.875 10.75C9.46079 10.75 9.125 10.4142 9.125 10C9.125 9.58579 9.46079 9.25 9.875 9.25L15.875 9.25C16.2892 9.25 16.625 9.58579 16.625 10C16.625 10.4142 16.2892 10.75 15.875 10.75z" fill="currentColor">
                                                            </path>
                                                            <path d="M17.375 14.75L11.375 14.75C10.9608 14.75 10.625 14.4142 10.625 14C10.625 13.5858 10.9608 13.25 11.375 13.25L17.375 13.25C17.7892 13.25 18.125 13.5858 18.125 14C18.125 14.4142 17.7892 14.75 17.375 14.75z" fill="currentColor"></path><path d="M7.875 10C7.875 10.4142 7.53921 10.75 7.125 10.75L6.625 10.75C6.21079 10.75 5.875 10.4142 5.875 10C5.875 9.58579 6.21079 9.25 6.625 9.25L7.125 9.25C7.53921 9.25 7.875 9.58579 7.875 10z" fill="currentColor"></path><path d="M9.375 14C9.375 14.4142 9.03921 14.75 8.625 14.75L8.125 14.75C7.71079 14.75 7.375 14.4142 7.375 14C7.375 13.5858 7.71079 13.25 8.125 13.25L8.625 13.25C9.03921 13.25 9.375 13.5858 9.375 14z" fill="currentColor">
                                                            </path>
                                                        </svg>
                                                        <span>{{ formatView(item.video_review) }}</span>
                                                    </span>
                                                </div>
                                                <div class="card-mask-info-right">{{ formatDuration(item.duration) }}</div>
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
                                    <div class="card-title flex-between">
                                        <span v-html="item.title"></span>
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
                                                v-if="!item.rcmd_reason || item.rcmd_reason.reason_type !== 3"
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
                                            <span class="card-info-bottom-author">{{ item.author }} · {{ formatTime(item.pubdate) }}</span>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </template>

                </div>
                <div class="skeleton-wrap" style="--cover-radio: 56.25%;" v-if="isLoading">
                    <div class="box-card-skeleton" v-for="(index) in Array.from({ length: pageSize },  (_, i) => i)" :key="index">
                        <div class="card-skeleton-cover"></div>
                        <div class="card-skeleton-info">
                            <p class="card-skeleton-text"></p>
                            <p class="card-skeleton-text short"></p>
                            <p class="card-skeleton-text-light"></p>
                        </div>
                    </div>
                </div>
                <el-pagination 
                    background 
                    layout="prev, pager, next"
                    prev-text="上一页"
                    next-text="下一页"
                    :total="numMaxResults"
                    v-model:page-size="pageSize" 
                    v-model:current-page="currentPage"
                    @current-change="handleChangePage"
                />
                <div class="refresh-btn-search flex-center" @click="refreshRcmdVideo">
                    <svg data-v-d03408ae="" xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink" viewBox="0 0 24 24" width="24" height="24" 
                    class="btn-icon" fill="currentColor">
                        <path d="M12 4.5C7.85786 4.5 4.5 7.85786 4.5 12C4.5 16.1421 7.85786 19.5 12 19.5C14.0667 19.5 15.9365 18.6654 
                        17.2941 17.3125C17.6853 16.9226 18.3185 16.9237 18.7083 17.3149C19.0982 17.7061 19.0971 18.3393 18.7059 18.7291C16.9887 20.4404 14.6172 21.5 12 
                        21.5C6.75329 21.5 2.5 17.2467 2.5 12C2.5 6.75329 6.75329 2.5 12 2.5C17.2467 2.5 21.5 6.75329 21.5 12C21.5 12.356 21.4804 12.7078 21.4421 
                        13.0543C21.3814 13.6033 20.8872 13.9991 20.3382 13.9384C19.7893 13.8777 19.3935 13.3835 19.4542 12.8346C19.4844 12.5609 19.5 12.2825 19.5 
                        12C19.5 7.85786 16.1421 4.5 12 4.5z" fill="currentColor">
                        </path>
                        <path d="M17.2929 10.7929C17.6834 10.4024 18.3166 10.4024 18.7071 10.7929L20.5 
                            12.5858L22.2929 10.7929C22.6834 10.4024 23.3166 10.4024 23.7071 10.7929C24.0976 11.1834 24.0976 11.8166 23.7071 12.2071L21.3839 14.5303C20.8957 
                            15.0185 20.1043 15.0185 19.6161 14.5303L17.2929 12.2071C16.9024 11.8166 16.9024 11.1834 17.2929 10.7929z" fill="currentColor">
                        </path>
                    </svg>
                </div>
            </section>
        </div>

        <div id="sentinel"></div>
    </div>
</template>

<script setup lang="ts">
    import {  ref, onMounted, onUnmounted, watch, computed } from 'vue';
    import { useStore } from 'vuex';
    import { useRoute } from 'vue-router';
    import * as R from 'ramda';

    import debounce from '@/utils/common/debounce';
    import encWbi from '@/utils/wrid';
    import fetchVideoStream from '@/utils/videoStreamPreview';
    import stopPreview from '@/utils/stopPreview';
    import { debounceSetContainerWidth } from '@/utils/container';
    import {
        formatView,
        formatTime
    } from '@/utils/videoFormatInfo';
    import { getTypeSearchList } from '@/api/home/search';
    import { getHomePlayUrl, getHomeVideoInfo } from '@/api/home';

    interface SearchVideoItem {
        author: string;
        aid: number;
        bvid: string;
        cid?: number;
        duration: string;
        id: number;
        title: string;
        type: string;
        pic: string;
        pubdate: number;
        play: number;
        owner: {
            name: string;
        };
        rcmd_reason: {
            reason_type: number;
            content: string;
        };
        videoSrc: string;
        video_review: number;
    }

    interface OrderBtn {
        text: string;
        index: number;
        type: string;
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

    const emit = defineEmits(['changeSize', 'updateNav']);
    const route = useRoute();
    const store = useStore();
    const sessdata: string = store.state.userModule.sessdata;
    const contentRef = ref<HTMLElement | null>(null);

    const orderBtnList = ref<OrderBtn[]>([
        { text: '综合排序', index: 0, type: 'totalrank' },
        { text: '最多点击', index: 1, type: 'click' },
        { text: '最新发布', index: 2, type: 'pubdate' },
        { text: '最多弹幕', index: 3, type: 'dm' },
        { text: '最多收藏', index: 4, type: 'stow' }
    ]);
    let curOrderIndex = ref<number>(0);
    const updateCurOrderIndex = (index: number) => {
        curOrderIndex.value = index;
    };
    const handleClickTabOrderBtn = async (index: number) => {
        if(curOrderIndex.value == index || typeof index != 'number') return;
        updateCurOrderIndex(index);
        updateCurrentPage(1);
        if(typeof route.query.keyword === 'string') {
            await fetchTypeSearchList(route.query.keyword);
        };
    };
    // 每页的最大数据量
    const pageMaxSize = ref<number>(30);
    // 每页显示数
    let pageSize = ref<number>(30);
    let currentPage = ref<number>(1);
    const updateCurrentPage = (page: number) => {
        if(typeof page !== 'number') return;
        currentPage.value = page;
    };
    // 当前搜索结果的查询开头的位次
    let offset = ref<number>(0);
    // 总的搜索结果数
    let numMaxResults = ref<number>(1000);
    const handleResize = function (_event: Event | null, options?: { isFirst?: boolean }) {
        if(!contentRef.value) return;
        const width = document.body.clientWidth;
        if(width >= 1500) {
            pageSize.value = 30;
        }
        else {
            pageSize.value = 24;
        };
        updateCurrentPage(Math.floor(offset.value / pageSize.value + 1));
        debounceSetContainerWidth({ contentRef, ...options });
        emit('changeSize');
    };
    const handleChangePage = async () => {
        offset.value = (currentPage.value - 1) * pageSize.value;
        if(typeof route.query.keyword === 'string') {
            await fetchTypeSearchList(route.query.keyword);
        };
    };
    let searchVideos = ref<SearchVideoItem[]>([]);
    let searchFilterVideos = computed<SearchVideoItem[]>(() => R.slice(0, pageSize.value)(searchVideos.value));
    let curMouseIndex = ref<number>(-1);
    let videoBlobUrls = ref<string[]>([]);
    let videoRefs = ref<(HTMLVideoElement)[]>([]);  // 视频 DOM 元素的引用数组

    // 状态变量
    let isLoading = ref<boolean>(true);

    const resetsearchVideos = () => {
        searchVideos.value = [];
    };
    const refreshRcmdVideo = async () => {
        if(isLoading.value) return;
        resetsearchVideos();
        try {
            if(typeof route.query.keyword === 'string') {
                await fetchTypeSearchList(route.query.keyword);
            };
        } catch(err) {
            console.log('err fetch', err);
        };
    };

    const fetchHomeRcmdPlayUrl = R.curry(async (item: SearchVideoItem, sessdata: string): Promise<VideoDashItem[] | null> => {
        const { bvid, cid } = item;
        const response = await getHomePlayUrl({bvid, cid, fnval: 16}, sessdata);
        const successAction = R.pipe(
            R.path(['data', 'dash', 'video']) as (data: any) => VideoDashItem[],
            R.filter(R.propEq(32, 'id'))
        );
        const failAction = () => null;
        return R.ifElse(
            R.propEq(0, 'code'),
            successAction,
            failAction
        )(R.path(['data'], response));
    });

    const playVideo = debounce(async (item, index) => {
        const videosStreamInfo = await fetchHomeRcmdPlayUrl(item, sessdata);
        if(!videosStreamInfo) return;
        await fetchVideoStream(videosStreamInfo, index, searchFilterVideos.value[index], videoRefs, videoBlobUrls, curMouseIndex);
    });

    const handleMouseEnter = async (item: SearchVideoItem, index: number): Promise<void> => {
        if(index === curMouseIndex.value) return;
        curMouseIndex.value = index;
        try {
            if(!('cid' in item)) {
                const response = await getHomeVideoInfo({ bvid: item.bvid || '', aid: item.aid ? item.aid.toString() : '' }, sessdata);
                const successAction = R.pipe(
                    R.pathOr(-1, ['data', 'cid']),
                    R.tap((cid: number) => {
                        item.cid = cid;
                    }),
                );
                const failAction = R.pipe(
                    R.pathOr('', ['message']),
                    R.when(
                        (message: string) => message !== '' && message !== 'undefined',
                        (message: string) => {
                            ElMessage.error(message);
                            throw new Error(message);
                        },
                    )
                );
                R.ifElse(
                    R.propEq(0, 'code'),
                    successAction,
                    failAction
                )(R.path(['data'], response));
            };
        } catch(err) {
            console.log('获取cid失败', err);
            return;
        };
        if(curMouseIndex.value === index) {
            playVideo(item, index);
        };
    };

    const stopPlayPreview = (item: SearchVideoItem, index: number) => {
        const videoRef = R.pathOr(null, [index], videoRefs.value);
        if(!videoRef) return;
        stopPreview(item, videoRef, playVideo, curMouseIndex);
    };
    const handleMouseLeave = (item: SearchVideoItem, index: number) => {
        stopPlayPreview(item, index);
        curMouseIndex.value = -1;
    };

    let curPlayerWindowIndex = ref<number>(-1);
    const updateCurPlayerWindowIndex = (index: number) => {
        curPlayerWindowIndex.value = index;
    };
    const openPlayerWindow = (videoItem: SearchVideoItem, index: number) => {
        const { id, bvid } = videoItem;
        const jsonData = JSON.stringify({ aid: id, bvid, windowId: 'video' });
        if(curPlayerWindowIndex.value == index) {
            window.electronAPI.sendMessage('player_focus', jsonData);
        }
        else {
            window.electronAPI.sendMessage('player_create', jsonData);
        };
        updateCurPlayerWindowIndex(index);
        stopPlayPreview(videoItem, index);
    };

    const formatDuration = R.pipe(
        R.split(':'),
        R.map(Number),
        ([minutes = 0, seconds = 0]) => {
            let hours = 0;
            // 将秒数转为分钟
            if (seconds >= 60) {
                minutes += Math.floor(seconds / 60);
                seconds = seconds % 60;
            };
            // 将分钟转为小时
            if (minutes >= 60) {
                hours += Math.floor(minutes / 60);
                minutes = minutes % 60;
            };
            if(hours > 0) {
                return [hours, minutes, seconds];
            }
            else {
                return [minutes, seconds];
            };
        },
        R.map(num => String(num).padStart(2, '0')),
        R.join(':')
    );

    const fetchTypeSearchList = async (keyword: string) => {
        try {
            isLoading.value = true;
            const wbi_key = store.state.userModule.wbi_key;
            const { img_key, sub_key } = wbi_key;
            const params = {
                search_type: 'video',
                keyword,
                web_location: 1430654,
                page: currentPage.value === 1 ? 1 : 2,
                page_size: pageMaxSize.value,
                dynamic_offset: offset.value,
                order: orderBtnList.value[curOrderIndex.value].type || ''
            };
            const queryString = encWbi(params, img_key, sub_key);
            const newParams = new URLSearchParams(queryString);
            // 将 URLSearchParams 转换为对象
            const paramsObj = Object.fromEntries(newParams.entries());
            const compeleteParams = {
                keyword: paramsObj.keyword,
                search_type: paramsObj.search_type,
                ...paramsObj
            };
            const response = await getTypeSearchList(compeleteParams, sessdata);
            const successAction = R.pipe(
                R.pathOr({result: [] as SearchVideoItem[], numResults: numMaxResults.value as number}, ['data']),
                R.tap((val) => {
                    searchVideos.value = val.result;
                    numMaxResults.value = val.numResults;
                }),
            );
            const failAction = R.pipe(
                R.pathOr('', ['message']),
                R.when(
                    (message: string) => message !== '' && message !== 'undefined',
                    (message: string) => {
                        ElMessage.error(message);
                        throw new Error(message);
                    },
                )
            );
            R.ifElse(
                R.propEq(0, 'code'),
                successAction,
                failAction
            )(R.path(['data'], response));
        } catch(err) {
            console.log('err fetch', err);
        } finally {
            isLoading.value = false;
        };
    };

    watch(() => route.query.keyword, async (newVal, oldVal) => {
        if(typeof newVal === 'string' && newVal !== oldVal && newVal) {
            await fetchTypeSearchList(newVal);
        };
    });

    onMounted(async () => {
        try {
            window.addEventListener('resize', handleResize);
            handleResize(null, { isFirst: true });
            if('keyword' in route.query && typeof route.query.keyword === 'string' ) {
                const keyword = route.query.keyword;
                await fetchTypeSearchList(keyword);
            };
        } catch(err) {
            console.log('err fetch', err);
        } finally {
            isLoading.value = false;
        };
    });

    onUnmounted(() => {
        videoBlobUrls.value.forEach(url => {
            URL.revokeObjectURL(url);
        });
        window.removeEventListener('resize', handleResize);
    });
 
   
</script>

<style lang="scss" scoped>
    ::-webkit-scrollbar {
        width: 8px;
    }
    ::-webkit-scrollbar-track {
        background: var(--bg2-float);
    }
    ::-webkit-scrollbar-thumb {
        background-color: #888;
        border-radius: 5px;
    }
    ::-webkit-scrollbar-thumb:hover {
        background: #555;
    }
    @media (min-width: 2000px) {
        .content-search {
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
        .content-wrap, .skeleton-wrap {
            grid-template-columns: minmax(240px, 1fr) minmax(240px, 1fr) minmax(240px, 1fr) minmax(240px, 1fr) minmax(240px, 1fr);
        }
    }
    // min值必须比 min-width 的 二分之一要小 因为有margin

    @media (max-width: 1500px) {
    // (1000 - 70 - 40 * 2 - 20 * 3) / 4
        .content-wrap, .skeleton-wrap {
            grid-template-columns: minmax(180px, 1fr) minmax(180px, 1fr) minmax(180px, 1fr) minmax(180px, 1fr);
        }
    }
    .container-search {
        box-sizing: border-box;
        height: calc(100vh - var(--nav-height));
        overflow-y: scroll;
        .order-search {
            display: flex;
            align-items: center;
            margin-top: 20px;
            .order-btn {
                width: 80px;
                margin-right: 15px;
                padding: 7px;
                text-align: center;
                border-radius: 5px;
                cursor: pointer;
                font-size: 13px;
                box-sizing: border-box;
                color: var(--theme-text-color);
                transition: .2s;
                &:hover {
                    color: var(--brand-pink);
                }
            }
            .order-btn-active {
                color: var(--hot-tab-color);
                background-color: var(--hot-tab-bg);
            }
        }
        .content-search {
            margin-top: 30px;
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
            .content-wrap {
                display: grid;
                grid-gap: 30px 20px;
                margin-bottom: 20px;
                margin-bottom: 50px;
                .box-card {
                    position: relative;
                    box-sizing: border-box;
                    .box-card-wrap {
                        width: 100%;
                        .card-content {
                            position: relative;
                            width: 100%;
                            aspect-ratio: 100 / 56.25;
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
                                .img-wrap {
                                    width: 100%;
                                    height: 100%;
                                    background-color: var(--graph_bg_regular);
                                    img {
                                        width: 100%;
                                        height: 100%;
                                    }
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
                            margin-top: var(--info-margin-top);
                            .card-title {
                                transition: .2s;
                                // 多行文本溢出省略号
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
                                margin-top: 4px;
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
            :deep(.el-pagination) {
                justify-content: center;
                margin-bottom: 20px;
                button {
                    border-radius: 3px;
                    padding: 0 10px;
                    background-color: var(--button-bg-color);
                    color: var(--theme-text-color);
                    border: 1px solid var(--button-border-color);
                    transition: .2s;
                    &:not([disabled]):hover {
                        background-color: var(--button-bg-color-hover);
                    }
                    &:disabled {
                        color: var(--button-color-disabled);
                        background-color: var(--button-bg-color-disabled);
                        border: 1px solid var(--button-border-color-disabled);
                    }
                }
                .el-pager {
                    li {
                        border-radius: 3px;
                        background-color: var(--button-bg-color);
                        color: var(--theme-text-color);
                        border: 1px solid var(--button-border-color);
                        transition: .2s;
                        &:not(.is-active):hover {
                            background-color: var(--button-bg-color-hover);
                        }
                    }
                    .is-active {
                        background-color: var(--brand-pink);
                    }
                }
            }
        }
        .refresh-btn-search {
            position: fixed;
            bottom: 50px;
            right: 16px;
            width: 40px;
            height: 40px;
            background-color: var(--button-bg-color);
            color: var(--theme-text-color);
            border-radius: 7px;
            overflow: hidden;
            box-shadow: 0px 0px 3px var(--bg1-float-hover);
            transition: .3s;
            &:hover {
                background-color: var(--button-bg-color-hover);
            }
            svg {
                width: 24px;
                height: 24px;
            }
        }
        .theme-failed {
            display: flex;
            flex-direction: column;
            align-items: center;
            width: 100%;
        }
    }
</style>
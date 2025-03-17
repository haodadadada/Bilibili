<template>
    <div class="container-bangumi">
        <div class="bangumi-page-wrapper mb-20">
            <div class="wrapper-header">
                <span>番剧推荐</span>
            </div>
            <section class="page-content">
                <div class="cards-content flex-between">
                    <div class="box-card" v-for="card of animeDramas" :key="card.rank">
                        <div class="card-cover mb-10">
                            <img :src="card.cover" alt="">
                            <div class="card-mask">
                                <div class="corner-tag-vip pl-14 pr-5 flex-center" v-if="card.badge_type === 0">
                                    <svg data-v-7b35db32="" width="18" height="18" viewBox="0 0 18 18" fill="none" xmlns="http://www.w3.org/2000/svg" class="tag-svg mr-5">
                                        <path fill-rule="evenodd" clip-rule="evenodd" d="M0 9.00006C0 13.9708 4.02915 18 9.00006 18C13.9708 18 18 13.9708 18 9.00006C18 4.02915 13.9708 0 9.00006 0C4.02915 0 0 4.02915 0 9.00006Z" fill="#FF6699">
                                        </path>
                                        <path d="M13.1134 6.39309V6.38997H10.0695C10.0892 6.14695 10.1006 5.90082 10.1006 5.6526C10.1006 5.37531 10.0871 5.1001 10.0622 4.82904C10.0632 4.81138 10.0653 4.79373 10.0653 4.77503V4.77192C10.0653 4.20695 9.60733 3.75 9.0434 3.75C8.47842 3.75 8.02147 4.20799 8.02147 4.77192V4.77503C8.02147 4.84461 8.02874 4.91316 8.04224 4.97859L8.0277 4.98067C8.04847 5.20188 8.0599 5.42516 8.0599 5.65156C8.0599 5.90082 8.04639 6.14695 8.02147 6.38892H4.8913V6.39309C4.35854 6.42735 3.93585 6.86977 3.93585 7.4119V7.415C3.93585 7.97998 4.36892 8.43278 4.93285 8.43278C4.97647 8.43278 5.02112 8.43486 5.09174 8.43381L7.48454 8.42863C6.87803 9.83066 5.82599 10.9938 4.50808 11.7405C4.50185 11.7437 4.49666 11.7467 4.49043 11.7509C4.47589 11.7592 4.46239 11.7675 4.44785 11.7759L4.44889 11.7769C4.16121 11.9576 3.96908 12.2775 3.96908 12.642V12.6452C3.96908 13.21 4.42707 13.667 4.991 13.667C5.21014 13.667 5.41162 13.5975 5.57778 13.4811C7.49804 12.372 8.97173 10.5763 9.66444 8.4307H12.9493C13.0023 8.43174 13.0813 8.42863 13.0813 8.42863C13.6951 8.41616 14.0979 7.98205 14.0979 7.41812V7.415C14.0991 6.86147 13.6608 6.41282 13.1134 6.39309Z" fill="white">
                                        </path>
                                        <path d="M13.9296 12.1574C13.9275 12.1532 13.9244 12.15 13.9223 12.147C13.887 12.0836 13.8455 12.0254 13.7987 11.9714C13.1392 11.0368 12.3095 10.2319 11.3509 9.60564L11.3499 9.60668C11.1826 9.48621 10.9771 9.41455 10.7558 9.41455C10.1909 9.41455 9.73389 9.87255 9.73389 10.4365V10.4396C9.73389 10.8259 9.94886 11.1624 10.2656 11.3359C11.0861 11.878 11.7559 12.499 12.2856 13.3288L12.3406 13.3983C12.5224 13.5646 12.7634 13.6673 13.0292 13.6673C13.5942 13.6673 14.0511 13.2093 14.0511 12.6455V12.6423C14.05 12.4668 14.0065 12.3017 13.9296 12.1574Z" fill="white">
                                        </path>
                                    </svg>
                                    <span class="text-[13px] text-cenrer">{{ card.badge }}</span>
                                </div>
                                <div class="corner-tag-belong pl-10 pr-5 flex-center" v-if="card.badge_type === 1">
                                    <span class="text-[13] text-center">{{ card.badge }}</span>
                                </div>
                                <div class="card-mask-info flex-end">
                                    <div class="card-mask-info-right weight-5 text-[13px]">{{ card.desc }}</div>
                                </div>
                            </div>
                        </div>
                        <div class="card-info">
                            <div class="card-title text-[13px]">{{ card.title }}</div>
                        </div>
                    </div>
                </div>
            </section>
        </div>
        <div class="bangumi-page-wrapper mb-20">
            <div class="wrapper-header">
                <span>国创推荐</span>
            </div>
            <section class="page-content">
                <div class="cards-content flex-between">
                    <div class="box-card mr-10" v-for="card of guochuangDramas" :key="card.rank">
                        <div class="card-cover mb-10">
                            <img :src="card.cover" alt="">
                            <div class="card-mask">
                                <div class="corner-tag-vip pl-14 pr-5 flex-center" v-if="card.badge_type === 0">
                                    <svg data-v-7b35db32="" width="18" height="18" viewBox="0 0 18 18" fill="none" xmlns="http://www.w3.org/2000/svg" class="tag-svg mr-5">
                                        <path fill-rule="evenodd" clip-rule="evenodd" d="M0 9.00006C0 13.9708 4.02915 18 9.00006 18C13.9708 18 18 13.9708 18 9.00006C18 4.02915 13.9708 0 9.00006 0C4.02915 0 0 4.02915 0 9.00006Z" fill="#FF6699">
                                        </path>
                                        <path d="M13.1134 6.39309V6.38997H10.0695C10.0892 6.14695 10.1006 5.90082 10.1006 5.6526C10.1006 5.37531 10.0871 5.1001 10.0622 4.82904C10.0632 4.81138 10.0653 4.79373 10.0653 4.77503V4.77192C10.0653 4.20695 9.60733 3.75 9.0434 3.75C8.47842 3.75 8.02147 4.20799 8.02147 4.77192V4.77503C8.02147 4.84461 8.02874 4.91316 8.04224 4.97859L8.0277 4.98067C8.04847 5.20188 8.0599 5.42516 8.0599 5.65156C8.0599 5.90082 8.04639 6.14695 8.02147 6.38892H4.8913V6.39309C4.35854 6.42735 3.93585 6.86977 3.93585 7.4119V7.415C3.93585 7.97998 4.36892 8.43278 4.93285 8.43278C4.97647 8.43278 5.02112 8.43486 5.09174 8.43381L7.48454 8.42863C6.87803 9.83066 5.82599 10.9938 4.50808 11.7405C4.50185 11.7437 4.49666 11.7467 4.49043 11.7509C4.47589 11.7592 4.46239 11.7675 4.44785 11.7759L4.44889 11.7769C4.16121 11.9576 3.96908 12.2775 3.96908 12.642V12.6452C3.96908 13.21 4.42707 13.667 4.991 13.667C5.21014 13.667 5.41162 13.5975 5.57778 13.4811C7.49804 12.372 8.97173 10.5763 9.66444 8.4307H12.9493C13.0023 8.43174 13.0813 8.42863 13.0813 8.42863C13.6951 8.41616 14.0979 7.98205 14.0979 7.41812V7.415C14.0991 6.86147 13.6608 6.41282 13.1134 6.39309Z" fill="white">
                                        </path>
                                        <path d="M13.9296 12.1574C13.9275 12.1532 13.9244 12.15 13.9223 12.147C13.887 12.0836 13.8455 12.0254 13.7987 11.9714C13.1392 11.0368 12.3095 10.2319 11.3509 9.60564L11.3499 9.60668C11.1826 9.48621 10.9771 9.41455 10.7558 9.41455C10.1909 9.41455 9.73389 9.87255 9.73389 10.4365V10.4396C9.73389 10.8259 9.94886 11.1624 10.2656 11.3359C11.0861 11.878 11.7559 12.499 12.2856 13.3288L12.3406 13.3983C12.5224 13.5646 12.7634 13.6673 13.0292 13.6673C13.5942 13.6673 14.0511 13.2093 14.0511 12.6455V12.6423C14.05 12.4668 14.0065 12.3017 13.9296 12.1574Z" fill="white">
                                        </path>
                                    </svg>
                                    <span class="text-[13px] text-cenrer">{{ card.badge }}</span>
                                </div>
                                <div class="corner-tag-belong pl-10 pr-5 flex-center" v-if="card.badge_type === 1">
                                    <span class="text-[13px] text-center">{{ card.badge }}</span>
                                </div>
                                <div class="card-mask-info flex-end">
                                    <div class="card-mask-info-right weight-5 text-[13px]">{{ card.desc }}</div>
                                </div>
                            </div>
                        </div>
                        <div class="card-info">
                            <div class="card-title text-[13px]">{{ card.title }}</div>
                        </div>
                    </div>
                </div>
            </section>
        </div>
    </div>
</template>

<script setup lang="ts">
    import { ref, onActivated } from 'vue';
    import { useStore } from 'vuex';
    import * as R from 'ramda';
    import encWbi from '@/utils/wrid';
    import { getHomePgcRank } from '@/api/home/hot';

    interface AnimeItem {
        rank: number;
        title: string;
        cover: string;
        badge: string;
        badge_type: number;
        desc: string;
    };

    interface GuochuangItem {
        rank: number;
        title: string;
        cover: string;
        badge: string;
        badge_type: number;
        desc: string;
    };

    const store = useStore();
    const sessdata: string = store.state.userModule.sessdata;
    let animeDramas = ref<AnimeItem[]>([]);
    let guochuangDramas = ref<GuochuangItem[]>([]);
    const fetchHomePgcRankList = async (season_type: number): Promise<AnimeItem[] | GuochuangItem[] | null> => {
        const wbi_key = store.state.userModule.wbi_key;
        const { img_key, sub_key } = wbi_key;
        const params = { season_type, day: 3, web_location: 333.934 };
        const queryString = encWbi(params, img_key, sub_key);
        const newParams = new URLSearchParams(queryString);
        // 将 URLSearchParams 转换为对象
        const paramsObj = Object.fromEntries(newParams.entries());
        if(!paramsObj.season_type) {
            console.log('season_type不能为空');
            return null;
        };
        const completeParamsObj = {
            season_type: paramsObj.season_type,
            web_location: paramsObj.web_location || '',
            day: paramsObj.day || '',
            wts: paramsObj.wts || '',
            w_rid: paramsObj.wridts || '',
            ...paramsObj,
        };
        const response = await getHomePgcRank(completeParamsObj, sessdata);
        const successAction = R.pipe(
            R.path(['data', 'list']) as (data: any) => any[],
            R.when(
                (list: any[]) => list.length > 7,
                list => R.slice(0, 7)(list)
            )
        );
        const failAction = R.pipe(
            R.pathOr('', ['message']),
            R.when(
                (message: string) => message !== '' && message !== 'undefined',
                ElMessage.error
            ),
            () => null
        );
        return R.ifElse(   
            R.propEq(0, 'code'),
            successAction,
            failAction
        )(R.path(['data'], response));
    };

    onActivated(async () => {
        animeDramas.value = await fetchHomePgcRankList(1) || [];
        guochuangDramas.value = await fetchHomePgcRankList(4) || [];
    });
</script>

<style lang="scss" scoped>
    $topDistance: 90px;
    .container-bangumi {
        color: var(--theme-text-color);
        .bangumi-page-wrapper {
            .wrapper-header {
                line-height: $topDistance;
            }
            .page-content {
                width: 100%;
                .cards-content {
                    flex-wrap: nowrap;
                    overflow: hidden;
                    padding: 10px 10px;
                    .box-card {
                        position: relative;
                        width: 100%;
                        height: 100%;
                        .card-cover {
                            position: relative;
                            width: 100%;
                            height: 100%;
                            min-width: 100px;
                            aspect-ratio: 43 / 58;
                            border-radius: 5px;
                            overflow: hidden;
                            transition: 0.2s;
                            z-index: 1;
                            flex: 1;
                            &:hover {
                                transform: scale(1.05);
                            }
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
                                .corner-tag-vip {
                                    position: absolute;
                                    top: 5px;
                                    right: 0;
                                    background-color: var(--brand-pink);
                                    border-radius: 999px 0 0 999px;
                                    color: #fff;
                                    .tag-svg {
                                        position: absolute;
                                        left: 0;
                                        transform: translateX(-50%);
                                        border: 1px solid #fff;
                                        border-radius: 999px;
                                    }
                                }
                                .corner-tag-belong {
                                    position: absolute;
                                    top: 5px;
                                    right: 0;
                                    background-color: var(--brand-blue);
                                    border-radius: 999px 0 0 999px;
                                    color: #fff;
                                }

                                .card-mask-info {
                                    position: absolute;
                                    bottom: 0;
                                    right: 0;
                                    width: 100%;
                                    padding: 14px 5px 0px 0px;
                                    height: 38px;
                                    box-sizing: border-box;
                                    color: #fff;
                                    background-image: linear-gradient(180deg, rgba(0, 0, 0, 0) 0%, rgba(0, 0, 0, .8) 100%);
                                    font-size: var(--subtitle-font-size);
                                    line-height: var(--icon-size);
                                }
                            }
                        }
                        .card-info {
                            .card-title {
                                transition: .2s;
                                display: -webkit-box;
                                -webkit-box-orient: vertical; /* 垂直排列 */
                                overflow: hidden; /* 隐藏超出部分 */
                                text-overflow: ellipsis; /* 使用省略号表示超出部分 */
                                -webkit-line-clamp: 1; /* 限制行数，根据需要调整 */
                                height: var(--title-line-height);
                                line-height: var(--title-line-height);
                                color: var(--theme-text-color);
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
                                }
                            }
                        }
                    }
                    .box-card:not(:last-child) {
                        margin-right: 15px;
                    }
                }
            }
        }
    }
</style>
<template>
    <div class="container-hot">
        <header class="nav-tabs flex-between flex-center">
            <div 
                v-for="tab of tabList" 
                :key="tab.index" 
                @click="updateTabActiveIndex(tab.index)"
                class="tab flex-1 mr-10 text-[14px]" 
                :class="{'tab-active': tabActiveIndex === tab.index}"
            >
                {{ tab.title }}
            </div>
        </header>
        <router-view v-slot="{ Component }">
            <transition mode="out-in">
                <keep-alive >
                    <component :is="Component" @checkIsNewVideo="checkIsNewVideo"/>
                </keep-alive>
            </transition>
        </router-view>
    </div>
</template>

<script setup lang="ts">
    import { ref } from 'vue';
    import { useRouter } from 'vue-router';
    
    interface Tab {
        title: string;
        index: number;
        path: string
    };
    const emit = defineEmits(['checkIsNewVideo']);
    const checkIsNewVideo = (callback: (isNew: boolean) => unknown,index: number, routePath: string): void => {
        emit('checkIsNewVideo', callback, index, routePath);
    };
    let tabActiveIndex = ref(0);
    const tabList = ref<Tab[]>([
        {title: '综合热门', index: 0, path: '/home/hot/popular'},
        {title: '每周必看', index: 1, path: '/home/hot/series'},
        {title: '入站必刷', index: 2, path: '/home/hot/precious'},
        {title: '排行榜', index: 3, path: '/home/hot/rank'}
    ]); 
    
    const router = useRouter();
    const updateTabActiveIndex = async (index: number) => {
        const tabItem = tabList.value.find(item => item.index === index);
        if (!tabItem) return;
        const path: string = tabItem.path;
        tabActiveIndex.value = index;
        router.push(path);
    };
    updateTabActiveIndex(tabActiveIndex.value);
</script>

<style lang="scss" scoped>
    $topDistance: 90px;
    $brandPink: var(--brand-pink);
    .container-hot {
        position: relative;
        padding: $topDistance 0 0;
        .nav-tabs {
            position: absolute;
            left: 0;
            top: 0;
            width: 350px;
            height: $topDistance;
            color: var(--theme-text-color);
            .tab {
                text-align: center;
                padding: 5px 0;
                border-radius: 5px;
                transition: .2s;
                &:hover {
                    color: var(--brand-pink);
                }
            }
            .tab-active {
                color: var(--hot-tab-color);
                background-color: var(--hot-tab-bg);
            }
        }
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
            .content-hot {
                grid-template-columns: minmax(240px, 1fr) minmax(240px, 1fr) minmax(240px, 1fr) minmax(240px, 1fr) minmax(240px, 1fr);
            }
        }
        // min值必须比 min-width 的 二分之一要小 因为有margin

        @media (max-width: 1500px) {
        // (1000 - 70 - 40 * 2 - 20 * 3) / 4
            .content-hot {
                grid-template-columns: minmax(180px, 1fr) minmax(180px, 1fr) minmax(180px, 1fr) minmax(180px, 1fr);
            }
        }
        .content-hot {
            display: grid;
            grid-gap: 30px 20px;
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
        }
        .no-more {
            width: 100%;
            text-align: center;
            line-height: 50px;
            color: #666;
        }
    }
</style>
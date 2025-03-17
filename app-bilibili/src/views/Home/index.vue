<template>
    <div class="container" v-if="!isWaitingCheckInternet" ref="containerRef">
        <div class="content" ref="contentRef" v-if="internetStatus"> 
            <router-view v-slot="{ Component }">
                <transition mode="out-in">
                    <keep-alive>
                        <component 
                            :is="Component" 
                            @checkIsNewVideo="checkIsNewVideo" 
                            @checkIsNewLive="checkIsNewLive"
                            @scrollToTop="scrollToTop"
                        />
                    </keep-alive>
                </transition>
            </router-view>
        </div>
        <div class="theme-failed" v-else>
            <img src="@/assets/other/theme-failed.png" alt="">
            <span>哎呀! 好像加载失败了&gt;.&lt;</span>
        </div>
    </div>
</template>

<script setup lang="ts">
    import { ref, onActivated, onDeactivated, nextTick } from 'vue';
    import { debounceSetContainerWidth } from '@/utils/container';
    interface NavItem {
        path: string;
        name: string;
    };
    const emit = defineEmits(['changeSize', 'updateNav']);
    const containerRef = ref<HTMLElement | null>(null);
    const contentRef = ref<HTMLElement | null>(null);
    let navItems = ref([
        {
            path: '/home/live',
            name: '直播'
        },
        {
            path: '/home/recommand',
            name: '推荐'
        },        
        {
            path: '/home/hot',
            name: '热门'
        },        
        {
            path: '/home/bangumi',
            name: '追番'
        },
        {
            path: '/home/film',
            name: '影视'
        }
    ]);
    const updateNavItems = (navItems: NavItem[]) => {
        emit('updateNav', navItems);
    };
    const handleResize = function (_event: Event | null, options?: { isFirst?: boolean }) {
        if(contentRef.value === null) return;
        debounceSetContainerWidth({ contentRef, ...options });
        emit('changeSize');
    };

    const scrollToTop = () => {
        if(containerRef.value === null) return;
        containerRef.value.scrollTop = 0;
    };

    let isWaitingCheckInternet = ref<boolean>(true);
    let internetStatus = ref(true);

    let removeListener: (() => void) | null = null;

    let curPlayerWindowOfVideo = ref<{ index: number, routePath: string } | null>(null);
    const checkIsNewVideo = (callback: (isNew: boolean) => unknown, index: number, routePath: string): void => {
        // 判断是否是新的视频
        const isNew = curPlayerWindowOfVideo.value ? curPlayerWindowOfVideo.value.index != index || curPlayerWindowOfVideo.value.routePath != routePath : true;
        curPlayerWindowOfVideo.value = { index, routePath };
        callback(isNew);
    };

    let curPlayerWindowOfLive = ref<{ index: number, routePath: string } | null>(null);
    const checkIsNewLive = (callback: (isNew: boolean) => unknown, index: number, routePath: string): void => {
        // 判断是否是新的直播
        const isNew = curPlayerWindowOfLive.value ? curPlayerWindowOfLive.value.index != index || curPlayerWindowOfLive.value.routePath != routePath : true;
        curPlayerWindowOfLive.value = { index, routePath };
        callback(isNew);
    };

    onActivated(() => {
        updateNavItems(navItems.value);
        window.addEventListener('resize', handleResize);
        window.electronAPI.sendMessage('check_internet', JSON.stringify({ windowId: 'video' }));
        // 获取网络状态
        removeListener = window.electronAPI.receive('status_internet', async (status: boolean) => {
            if(typeof status === 'boolean') {
                internetStatus.value = status;
            };
            isWaitingCheckInternet.value = false;
            await nextTick();
            handleResize(null, { isFirst: true });
        });
    });
    onDeactivated(() => {
        window.removeEventListener('resize', handleResize);
        updateNavItems([]);
        if(removeListener) {
            removeListener();
        };
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
    .container {
        display: block;
        height: calc(100vh - var(--nav-height));
        overflow-y: scroll;
        .content {
            height: 100%;
        }
        .theme-failed {
            display: flex;
            flex-direction: column;
            justify-content: center;
            align-items: center;
            margin-top: 100px;
            color: var(--theme-text-color);
            font-size: 14px;
            span {
                margin-top: 30px;
            }
        }
    }
</style>
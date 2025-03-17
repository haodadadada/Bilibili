<template>
    <div class="container flex-column">
        <Navbar :windowMode="windowMode" @updateWindowMode="updateSelectedWindowMode"></Navbar>
        <div class="flex-between">
            <div class="flex-1 player">
                <Player :windowMode="windowMode" @updatePanelState="updatePanelState"></Player>
            </div>
            <Panel :reply="reply" v-show="isShowPanel && !isSmallWindow" class="panel"></Panel>
        </div>
    </div>
</template>

<script setup lang="ts">
    import { computed, onMounted, onUnmounted, provide, ref } from 'vue';
    import { useStore } from 'vuex';
    import * as R from 'ramda';
    import { getHomeVideoInfo } from '@/api/home/index';
    import throttle from '@/utils/common/throttle';
    import Navbar from '@/player_components/Navbar/index.vue';
    import Panel from './Panel/index.vue';
    import Player from './Player/index.vue';
    
    interface Option {
        label: string;
    }
    interface CommonSection {
        index: number;
        options: Option[];
    }
    interface CommonConfig {
        closeMain: CommonSection;
        fontFamily: CommonSection;
        isAutomatic: boolean;
        isShowCloseMainPrompt: boolean;
        isShowCloseMainTip: boolean;
        theme: CommonSection;
    }
    type DownloadConfig = unknown;

    interface Configure {
        common: CommonConfig,
        download: DownloadConfig
    }

    interface VideoInfoItem {
        aid: number,
        bvid: string,
        cid: number,
        owner: {
            face: string,
            mid: number,
            name: string
        },
        stat: {
            aid: number,
            coin: number,
            danmaku: number,
            dislike: number,
            evaluation: string,
            favorite: number, 
            like: number,
            reply: number,
            share: number,
            view: number
        },
        title: string,
    }

    const store = useStore();
    const sessdata: string = store.state.userModule.sessdata || '';
    // 通过ref实现响应式注入到多级子组件
    let videoInfo = ref<VideoInfoItem | null>({} as VideoInfoItem);
    let reply = ref();
    provide('videoInfo', videoInfo);
    let removeVideoLisenter: (() => void) | null = null;
    window.electronAPI.send('did-child-finish-load');
    removeVideoLisenter = window.electronAPI.receive('player_data_from_main', async data => {
        const ids = JSON.parse(data);
        videoInfo.value = await fetchVideoInfo(ids);
        if(videoInfo.value === null) {
            return;
        };
        reply.value = videoInfo.value.stat.reply;
    });
    let removeLoginLisenner: (() => void) | null = null;
    const watchLoginStateUpdate = () => {
        removeLoginLisenner = window.electronAPI.receive('update_login_to_player', () => {
            window.electronAPI.sendMessage('player_reload', JSON.stringify({ windowId: 'video' }));
        });
    };

    let isShowPanel = ref(true);
    const updatePanelState = (state: boolean) => {
        isShowPanel.value = state;
    };

    const fetchVideoInfo = async (ids: {aid?: '', bvid?: ''}): Promise<VideoInfoItem | null> => {
        const response = await getHomeVideoInfo(ids, sessdata);
        const successAction = R.pipe(
            R.path(['data']) as (data: any) => VideoInfoItem,
        );
        const failAction = R.pipe(
            R.pathOr('', ['message']),
            R.when(
                (message: string) => message !== '' && message !== 'undefined',
                (message: string) => {
                    ElMessage.error(message);
                    throw new Error(message);
                },
            ),
            () => null
        );
        
        return R.ifElse(
            R.propEq(0, 'code'),
            successAction,
            failAction
        )(R.path(['data'], response));
    };

    const setFontFamily = async (configData: Configure) => {
        const fontChoice = configData.common.fontFamily.index;
        if(fontChoice === 0) {
            document.body.style.fontFamily = 'system-ui, sans-serif';
        }
        else if(fontChoice === 1) {
            document.body.style.fontFamily = 'HarmonyOS Sans, sans-serif';
        };
    };
    
    const initSystemConfiguration = async () => {
        const configData: Configure = await window.electronAPI.invoke('get_setting');
        await setFontFamily(configData);
    };
    let removeFontListener: (() => void) | null = null;
    removeFontListener = window.electronAPI.receive('update_font_to_player', (message) => {
        const { fontIndex } = JSON.parse(message);
        if(fontIndex === 0) {
            document.body.style.fontFamily = 'system-ui, sans-serif';
            return;
        }
        else if(fontIndex === 1) {
            document.body.style.fontFamily = 'HarmonyOS Sans, sans-serif';
            return;
        };
    });

    // 用于判断窗口大小来决定是否切换到小窗口模式
    let windowMode = ref('normal');
    let isSmallWindow = computed(() => windowMode.value === 'small');
    // 用户选择的窗口模式用于锁定windowMode
    let userSelectedMode = ref('normal'); 
    const mode = ['normal', 'small'];
    // resize的最大宽度
    const smallWindowMaxWidth = 768;
    let normalWindowWidth = 1200;
    let normalWindowHeight = 600;
    let smallWindowWidth = 800;
    let smallWindowHeight = 600;
    const handleWindowResize = throttle(() => {
        if(userSelectedMode.value === 'small') {
            windowMode.value = 'small';
        }
        else if(window.innerWidth < smallWindowMaxWidth) {
            windowMode.value = 'small';
        }
        else {
            windowMode.value = 'normal';
        };
    }, 100);
    window.addEventListener('resize', handleWindowResize);
    const updateSelectedWindowMode = (status: string) => {
        if(!R.includes(status, mode)) {
            return;
        };
        userSelectedMode.value = status;
        windowMode.value = status;
        if(status === 'small') {
            normalWindowWidth = window.innerWidth;
            normalWindowHeight = window.innerHeight;
            window.resizeTo(smallWindowWidth, smallWindowHeight);
        }
        else {
            smallWindowWidth = window.innerWidth;
            smallWindowHeight = window.innerHeight;
            window.resizeTo(normalWindowWidth, normalWindowHeight);
        };
    };
    onMounted(async () => {
        watchLoginStateUpdate();
        await initSystemConfiguration();
    });
    onUnmounted(() => {
        if(removeVideoLisenter) {
            (removeVideoLisenter as () => void)();
        };
        if(removeLoginLisenner) {
            removeLoginLisenner();
        };
        if(removeFontListener) {
            (removeFontListener as () => void)();
        };
        window.removeEventListener('resize', handleWindowResize);
    });
</script>

<style lang="scss" scoped>
    @media screen and (max-width: 1000px) {
        .container {
            .panel {
                display: none;
            }
        }
    }
    * {
        padding: 0;
        margin: 0;
        user-select: none;
    }
    .container {
        width: 100vw;
        height: 100vh;
        background-color: #000;
        .player {
            height: calc(100vh - calc(var(--nav-height) / 1.5));
        }
    }
</style>
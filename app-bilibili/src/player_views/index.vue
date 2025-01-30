<template>
    <div class="container flex-column">
        <Navbar></Navbar>
        <div class="flex-between">
            <div class="flex-1 player">
                <Player @updatePanelState="updatePanelState"></Player>
            </div>
            <Panel :reply="reply" v-show="isShowPanel"></Panel>
        </div>
    </div>
</template>

<script setup lang="ts">
    import { onMounted, onUnmounted, provide, ref } from 'vue';
    import { useStore } from 'vuex';
    import { getHomeVideoInfo } from '@/api/home/index';
    import * as R from 'ramda';
    import Navbar from './Navbar/index.vue';
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
    removeVideoLisenter = window.electronAPI.receive('video_data_from_main', async data => {
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
            location.reload();
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
    removeFontListener = window.electronAPI.receive('update_font_to_player', (fontIndex) => {
        if(fontIndex === 0) {
            document.body.style.fontFamily = 'system-ui, sans-serif';
            return;
        }
        else if(fontIndex === 1) {
            document.body.style.fontFamily = 'HarmonyOS Sans, sans-serif';
            return;
        };
    });
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
    });
</script>

<style lang="scss" scoped>
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
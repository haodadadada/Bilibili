<template>
    <div class="container">
        <Navbar :windowId="'live'"></Navbar>
        <section class="content flex-between">
            <div class="flex-1 player">
                <Player 
                    @clearDanmakuScrollList="clearDanmakuScrollList"
                    @updatePanelState="updatePanelState"
                    :danmakuScrollList="danmakuScrollList" 
                    :roomMsg="roomMsg"
                ></Player>
            </div>
            <div class="panel ml-10" v-show="isShowPanel">
                <Panel :danmakuList="danmakuList" :roomid="roomid"></Panel>
            </div>
        </section>
    </div>
</template>

<script setup lang="ts">
    import { computed, ref, onUnmounted, provide, watch } from 'vue';
    import { useStore } from 'vuex';
    import encWbi from '@/utils/wrid';
    import { getLiveDanmakuUrl } from '@/api/home/live';
    import Navbar from '@/player_components/Navbar/index.vue';
    import Panel from './Panel/index.vue';
    import Player from './Player/index.vue';
    interface DanmakuItem {
        content: string;
        color?: number;
        emots: object | null;
        id_str: string;
        userName: string;
        medal: DanmakuUserMedal;
    }
    interface DanmakuUserMedal {
        color: number;
        color_border: number;
        color_end: number;
        color_start: number;
        v2_medal_color_border: string;
        v2_medal_color_end: string;
        v2_medal_color_level: string;
        v2_medal_color_start: string;
        v2_medal_color_text: string;
        name: string;
        level: number;
        guard_level: number;
        guard_icon?: string;
        honor_icon: string;
        id: number;
    }
    const store = useStore();
    const sessdata = store.state.userModule.sessdata || '';
    const userId = store.state.userModule.userInfo.mid || 0;
    let liveInfo = ref<{ roomid?: number }>({});
    provide('liveInfo', liveInfo);
    window.electronAPI.send('did-child-finish-load');
    let removeLiveLisenter: (() => void) | null = null;
    removeLiveLisenter = window.electronAPI.receive('player_data_from_main', async data => {
        liveInfo.value = { roomid: JSON.parse(data).roomid || 0 };
    });
    const roomid = computed(() => liveInfo.value.roomid || 0);
    const connectDanmakuStream = async (roomid: number) => {
        if(!roomid) {
            console.error('房间号为空');
            return;
        };
        const wbi_key = store.state.userModule.wbi_key;
        const { img_key, sub_key } = wbi_key;
        const params = { id: roomid };
        const queryString = encWbi(params, img_key, sub_key);
        const newParams = new URLSearchParams(queryString);
        const paramsObj = Object.fromEntries(newParams.entries());
        const completeParams = { id: roomid, ...paramsObj };
        const response = await getLiveDanmakuUrl(completeParams, sessdata);
        const key = response.data.data.token;
        const host = response.data.data.host_list[0].host;
        const port = response.data.data.host_list[0].wss_port;
        window.electronAPI.sendMessage('player_live_package',
        JSON.stringify({ roomid, key, uid: userId, host, wssPort: port, sessdata }));
    };
    watch(roomid, async (newVal) => {
        await connectDanmakuStream(newVal);
    });
    let isShowPanel = ref(true);
    const updatePanelState = (state: boolean) => {
        isShowPanel.value = state;
    };

    let removeInfoListener: (() => void) | null = null;
    let packageData = ref<{ danmakuList: DanmakuItem[], danmakuScrollList: DanmakuItem[], roomMsg: { watcherCount?: string, likeCount?: number } }>({
        danmakuList: [],
        danmakuScrollList: [],
        roomMsg: {
            watcherCount: '',
            likeCount: 0
        }
    });
    removeInfoListener = window.electronAPI.receive('get_live_package', async (jsonInfo: any) => {
        const data = JSON.parse(jsonInfo);
        if(data.cmd === 'DANMU_MSG') {
            const info = data.info[0][15];
            const emoticonUniqueInfo: any = data.info[0][13];
            let emotionUnique = {};
            if(typeof emoticonUniqueInfo === 'object' && 'emoticon_unique' in emoticonUniqueInfo) {
                const key: string = emoticonUniqueInfo.emoticon_unique.replace('upower_', '');
                emotionUnique = {
                    [key]: {
                        height: 40,
                        width: 40,
                        url: emoticonUniqueInfo.url
                    }
                };
            };
            const extra = JSON.parse(info.extra);
            const content: string = extra.content;
            const emots: object | null = { ...extra.emots, ...emotionUnique };
            const color: number = extra.color;
            const id_str: string = info.id_str;
            const userName: string = info.user.base.name;
            const medal: DanmakuUserMedal = info.user.medal;
            packageData.value.danmakuList.push({ content, emots, id_str, userName, medal });
            if (packageData.value.danmakuList.length > 100) {
                packageData.value.danmakuList = packageData.value.danmakuList.slice(20, packageData.value.danmakuList.length);
            };
            if(packageData.value.danmakuScrollList.length < 20) {
                packageData.value.danmakuScrollList.push({ content, color, emots, id_str, userName, medal });
            };
        };
        if(data.cmd === 'WATCHED_CHANGE') {
            packageData.value.roomMsg.watcherCount = data.data.text_large;
        };
        if(data.cmd === 'LIKE_INFO_V3_UPDATE') {
            packageData.value.roomMsg.likeCount = data.data.click_count;
        };
    });
    const clearDanmakuScrollList = (list: DanmakuItem[], index: number) => {
        if(index > list.length) packageData.value.danmakuScrollList = [];
        packageData.value.danmakuScrollList = list.splice(index, list.length);
    };
    const danmakuList = computed(() => packageData.value.danmakuList);
    const danmakuScrollList = computed(() => packageData.value.danmakuScrollList);
    const roomMsg = computed(() => packageData.value.roomMsg);
    onUnmounted(() => {
        if (removeLiveLisenter) {
            (removeLiveLisenter as () => void)();
        };
        if (removeInfoListener) {
            (removeInfoListener as () => void)();
        };
        window.electronAPI.send('player_stop_live_package');
    });
</script>

<style lang="scss" scoped>
    .container {
        width: 100vw;
        height: 100vh;
        background-color: #1e2022;
        .content {
            height: calc(100vh - calc(var(--nav-height) / 1.5));
        }
        .player {
            height: 100%;
        }
        .panel {
            flex-shrink: 0;
            width: 350px;
            height: 100%;
        }
    }
</style>
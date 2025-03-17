<template>
    <div class="navbar">
        <div class="main mr-15">
            <div class="nav-items">
                <div class="back flex-center" @click="handleClickBackBtn">
                     <component :is="home" class="img mr-5"></component>
                    <span class="text-[12px]">回到主界面</span>
                </div>
            </div>
            <div class="right-tools flex mr-10">
                <div class="icon-wrap">
                    <component :is="tacksImg" class="img fixed-btn" :class="{'tilt': !isSetTop}" @click="handleClickSetTopBtn"></component>
                </div>
                <div class="icon-wrap" @click="handleClickWindowModeBtn" v-if="props.windowMode">
                    <component :is="smallImg" class="img"></component>
                </div>
            </div>
        </div>
        <div class="line-vertical"></div>
        <div class="right flex-start ml-10">
            <div @click="zoom" class="icon-wrap flex-center" v-if="!isSmallWindow">
                <component :is="zoomImg" class="img"></component>
            </div>
            <div @click="cover" class="icon-wrap flex-center" v-if="!isSmallWindow">
                <component :is="fullImg" v-if="!isFull" class="img"></component>
                <component :is="exitfullImg" v-else class="img"></component>
            </div>
            <div @click="close" class="icon-wrap flex-center">
                <component :is="closeImg" class="img"></component>
            </div>
        </div>
    </div>
</template>

<script setup lang="js">
    import { computed, ref } from 'vue';
    import closeImg from '@/assets/icon/common/close_dark.svg';
    import exitfullImg from '@/assets/icon/nav/exit_full_sec.svg';
    import fullImg from '@/assets/icon/nav/full_dark.svg';
    import home from '@/assets/icon/side/home.svg';
    import smallImg from '@/assets/icon/nav/small.svg';
    import tacksImg from '@/assets/player/tacks.svg';
    import zoomImg from '@/assets/icon/nav/zoom_dark.svg';

    const emits = defineEmits(['updateWindowMode']);
    const props = defineProps(['windowMode', 'windowId']);
    const windowId = computed(() => props.windowId || 'video');
    const handleClickWindowModeBtn = () => {
        if(props.windowMode === 'normal') {
            emits('updateWindowMode','small');
            updateTopState(true);
            const jsonData = JSON.stringify({ windowId: windowId.value, isTop: isSetTop.value });
            window.electronAPI.sendMessage('player_set_top', jsonData);
        } else {
            emits('updateWindowMode','normal');
            updateTopState(false);
            const jsonData = JSON.stringify({ windowId: windowId.value, isTop: isSetTop.value });
            window.electronAPI.sendMessage('player_set_top', jsonData);
        };
    };
    let isSmallWindow = computed(() => props.windowMode === 'small');

    let isFull = ref(false);
    function changeIsFull() {
        isFull.value = !isFull.value;
    };
    const zoom = () => {
        window.electronAPI.sendMessage('player_zoom', JSON.stringify({ windowId: windowId.value }));
    };
    const cover = () => {
        const jsonData = JSON.stringify({ windowId: windowId.value, isFull: isFull.value });
        window.electronAPI.sendMessage('player_full_screen', jsonData);
        changeIsFull();
    };
    const close = () => {
        window.electronAPI.sendMessage('player_exit', JSON.stringify({ windowId: windowId.value }));
        if(windowId.value === 'live') {
            window.electronAPI.send('player_stop_live_package');
        };
    };

    const focusMainWindow = () => {
        window.electronAPI.send('main_focus');
    };

    const handleClickBackBtn = () => {
        focusMainWindow();
    };

    let isSetTop = ref(false);
    const updateTopState = state => {
        isSetTop.value = state;
    };
    const handleClickSetTopBtn = () => {
        updateTopState(!isSetTop.value);
        const jsonData = JSON.stringify({ windowId: windowId.value, isTop: isSetTop.value });
        window.electronAPI.sendMessage('player_set_top', jsonData);
    };
</script>

<style lang="scss" scoped>
    @media screen and (max-width: 768px) {
        .hide-small {
            display: none;
        }
    }
    .navbar {
        display: flex;
        justify-content: space-between;
        align-items: center;
        flex-shrink: 0;
        height: calc(var(--nav-height) / 1.5);
        width: 100%;
        padding: 10px 20px;
        box-sizing: border-box;
        border: #2f3134 1px solid;
        cursor: pointer;
        color: #e6e6e6;
        font-weight: 600;
        background: #1e2022;
        -webkit-app-region: drag;
        .main {
            flex: 1;
            display: flex;
            justify-content: space-between;
            align-items: center;
            box-sizing: border-box;
            height: 100%;
            .nav-items {
                display: flex;
                align-items: center;
                min-width: 120px;
                height: 100%;
                -webkit-app-region: no-drag;
                .back {
                    padding: 5px 10px;
                    background-color: #555;
                    border-radius: 5px;
                    &:hover {
                        background-color: lighten($color: #555, $amount: 20);
                    }
                    .img {
                        width: 18px;
                        height: 18px;
                    }
                }
            }
            .right-tools {
                -webkit-app-region: no-drag;
                .fixed-btn {
                    transition: .3s;
                }
                .tilt {
                    transform: rotate(45deg);
                }
            }
        }
        .line-vertical {
            height: 80%;
            width: 1px;
            background-color: var(--theme-hover-color);
        }
        .right {
            text-align: center;
            cursor: pointer;
            z-index: 99;
            width: 150px;
            box-sizing: border-box;
            -webkit-app-region: no-drag;
     
        }

        .icon-wrap {
            width: 20px;
            height: 20px;
            margin: 0 5px;
            padding: 5px;
            transition: .2s;
            border-radius: 5px;
            &:hover{
                background-color: var(--theme-hover-color);
            }
            .img {
                width: 20px;
                height: 20px;
            }
        }
    }
    .occupy {
        height: calc(var(--nav-height) / 1.5);
        width: 100%;
    }
</style>
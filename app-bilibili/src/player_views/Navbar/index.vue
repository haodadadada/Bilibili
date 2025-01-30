<template>
    <div class="navbar">
        <div class="main mr-15">
            <div class="nav-items">
                <div class="back flex-center" @click="handleClickBackBtn">
                     <component :is="home" class="img mr-5"></component>
                    <span class="size-12">回到主界面</span>
                </div>
            </div>
            <div class="right-tools flex">
                <div class="icon-wrap">
                    <component :is="tacksImg" class="img fixed-btn" :class="{'tilt': !isSetTop}" @click="handleClickSetTopBtn"></component>
                </div>
                <div class="icon-wrap">
                    <component :is="smallImg" class="img"></component>
                </div>
            </div>
        </div>
        <div class="right flex-center">
            <div @click="zoom" class="icon-wrap flex-center">
                <component :is="zoomImg" class="img"></component>
            </div>
            <div @click="cover" class="icon-wrap flex-center">
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
    import { ref } from 'vue';
    import closeImg from '@/assets/icon/common/close_dark.svg';
    import exitfullImg from '@/assets/icon/nav/exit_full_sec.svg';
    import fullImg from '@/assets/icon/nav/full_dark.svg';
    import zoomImg from '@/assets/icon/nav/zoom_dark.svg';
    import tacksImg from '@/assets/player/tacks.svg';
    import smallImg from '@/assets/icon/nav/small.svg';
    import home from '@/assets/icon/side/home.svg';

    let isFull = ref(false);
    function changeIsFull() {
        isFull.value = !isFull.value;
    }
    const zoom = () => {
        window.electronAPI.sendMessage('player_zoom', isFull.value);
    };
    const cover = () => {
        window.electronAPI.sendMessage('player_full_screen', isFull.value);
        changeIsFull();
    };
    const close = () => {
        window.electronAPI.sendMessage('player_exit');
    };

    const focusMainWindow = () => {
        window.electronAPI.sendMessage('main_focus');
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
        window.electronAPI.sendMessage('player_set_top', isSetTop.value);
    };
</script>

<style lang="scss" scoped>
.navbar {
    position: sticky;
    top: 0;
    display: flex;
    justify-content: space-between;
    align-items: center;
    z-index: 99;
    height: calc(var(--nav-height) / 1.5);
    width: 100%;
    padding: 10px 20px;
    box-sizing: border-box;
    cursor: pointer;
    color: #e6e6e6;
    font-weight: 600;
    background: var(--Ga9);
    -webkit-app-region: drag;
    .main {
        flex: 1;
        display: flex;
        justify-content: space-between;
        align-items: center;
        box-sizing: border-box;
        height: 100%;
        .nav-items {
            width: 450px;
            display: flex;
            align-items: center;
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

    .right {
        text-align: center;
        cursor: pointer;
        z-index: 99;
        width: 150px;
        box-sizing: border-box;
        border-left: 1px solid var(--theme-hover-color);
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
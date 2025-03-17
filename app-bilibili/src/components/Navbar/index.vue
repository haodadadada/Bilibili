<template>
    <div class="navbar">
        <div class="main mr-10">
            <div class="nav-items">
                <div class="logo">
                    <img :src="bilibiliIcon" alt="" class="img">
                </div>
                <div v-for="item of props.navItems" :key="item.path" @click="navigateTo(item.path)" :class="{'nav-active': activePath.includes(item.path)}" class="nav-item text-[15px]">
                    <div>{{ item.name }}</div>
                    <div class="nav-line" v-if="activePath.includes(item.path)"></div>
                </div>
            </div>
            <div class="search">
                <input v-model="keyword" type="text" class="search-ipt text-[12px]" placeholder="搜索感兴趣的视频" @keydown="handleSearchKeyDown">
            </div>
        </div>
 
        <div class="right flex-center">
            <div @click="zoom" class="icon-wrap flex-center">
                <component :is="zoomImg" class="img"></component>
            </div>
            <div @click="cover" class="icon-wrap flex-center">
                <component :is="fullImg" class="img" v-if="!isFull"></component>
                <component :is="exitFullImg" class="img" v-else></component>
            </div>
            <div @click="close" class="icon-wrap flex-center">
                <component :is="closeImg" class="img"></component>
            </div>
        </div>
    </div>
</template>

<script setup lang="ts">
    import { ref, watch } from 'vue';
    import { useRoute, useRouter } from 'vue-router';

    import bilibiliIcon from '@/assets/nav/bilibili.png';
    import closeImg from '@/assets/icon/common/close.svg';
    import exitFullImg from '@/assets/icon/nav/exit_full.svg';
    import fullImg from '@/assets/icon/nav/full.svg';
    import zoomImg from '@/assets/icon/nav/zoom.svg';

    interface NavIten {
        name: string;
        path: string;
    }

    const emit = defineEmits(['handleLogin', 'exit']);
    const props = defineProps<{
        navItems: NavIten[];
    }>();
    const router = useRouter();
    const route = useRoute(); 
    const activePath = ref('/home');
    changeActivePath(route.path);
    let navStatus = ref(true);
    const updateNavStatus = (status: boolean) => navStatus.value = status;
    let keyword = ref<string>('');
    // route.path 初始值为 '/'
    watch(route, (newValue) => {
        updateNavStatus(false);
        changeActivePath(newValue.fullPath);
        updateNavStatus(true);
        if(typeof route.query.keyword === 'string') keyword.value = route.query.keyword || '';
    });
    function changeActivePath(path: string) {
        activePath.value = path;
    };
    const navigateTo = function(url: string) {
        if(url === activePath.value || !url) return;
        router.push(url);
    };

    let isFull = ref(false);
    function changeIsFull() {
        isFull.value = !isFull.value;
    }
    const zoom = () => {
        window.electronAPI.sendMessage('app_exit', 0);
    };
    const cover = () => {
        window.electronAPI.sendMessage('full_screen', isFull.value);
        changeIsFull();
    };
    const close = () => {
        emit('exit');
    };

    const handleSearchKeyDown = async (event: KeyboardEvent) => {
        if (event.key === 'Enter' && event.target) {
            router.push('/search?keyword=' + (event.target as HTMLInputElement).value);
        };
    };
</script>

<style lang="scss" scoped>
.navbar {
    display: flex;
    justify-content: space-between;
    align-items: center;
    height: var(--nav-height);
    width: 100%;
    padding: 10px 20px;
    box-sizing: border-box;
    cursor: pointer;
    color: var(--theme-text-color);
    font-weight: 600;
    background: var(--theme-bg-color);
    border-bottom: 1px solid var(--theme-hover-color);
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
            .logo {
                display: flex;
                align-items: center;
                width: 90px;
                .img {
                    width: 100%;
                    max-height: 100%;
                }
            }
            .nav-item {
                position: relative;
                flex: 1;
                display: flex;
                align-items: center;
                justify-content: center;
                margin: 0 10px;
                transition: .2s;
                line-height: calc(var(--nav-height) / 2);
                height: 100%;
                max-width: 60px;
                &:not(.choosing):hover {
                    color: var(--brand-pink);
                }
                .nav-line {
                    position: absolute;
                    bottom: 0px;
                    left: 50%;
                    transform: translateX(-50%);
                    width: 20px;
                    height: 3px;
                    border-radius: 999px;
                    background-color: var(--brand-pink);
                }
            }
            .nav-active {
                color: var(--brand-pink);
            }
            .opacity-fade-enter-active, .opacity-fade-leave-active {
                transition: opacity 0.2s;
            }
            .opacity-fade-enter-from, .opacity-fade-leave-to {
                opacity: 0;
            }
        }
        .search {
            -webkit-app-region: no-drag;
            width: 270px;
            .search-ipt {
                width: 100%;
                height: 80%;
                padding: 5px 10px;
                border-radius: 5px;
                box-sizing: border-box;
                outline: none;
                border: none;
                height: calc(var(--nav-height) / 2);
                background-color: var(--theme-hover-color);
                color: var(--theme-text-color);
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
}

</style>
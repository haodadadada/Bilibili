<template>
    <div class="sidebar">
        <div class="side-top">
            <div class="flex-column flex-center pt-20" @click="handleClickBackBtn">
                <component :is="back" class="side-icon"></component>
            </div>
            <div
                v-for="icon of sideTopInfo" 
                :key="icon.index" 
                @mouseenter="handleMouseEnterSide(icon.index)" 
                @mouseleave="handleMouseLeaveSide" 
                @click="handleClickSideTopNav(icon.index)"
                class="flex-column flex-center mt-20 side-item"
                :class="selectColor(icon.index) ? 'side-color' : ''"
            >
                <component :is="icon.icon" class="side-icon"></component>
                <div class="size-12">{{ icon.name }}</div>
            </div>
        </div>
        <div class="side-placehold"></div>
        <div class="side-bottom">
            <div @click="handleClickPersonalBtn" v-if="!store.state.userModule.isLogin" class="btn-lg right-golg flex-center">
                <component :is="avatar_default" class="default"></component>
            </div>
            <div v-else class="flex-center">
                <img
                    v-if="userInfo.face"
                    class="default" 
                    :src="userInfo.face"
                    @click="handleClickPersonalBtn"
                >
                <component 
                    v-else
                    :is="avatar_default" 
                    class="default"
                >
                </component>
            </div>
            <div 
                v-for="icon of sideBottomInfo" 
                :key="icon.index" 
                @mouseenter="handleMouseEnterSide(icon.index)" 
                @mouseleave="handleMouseLeaveSide" 
                @click="handleClickSideBottomNav(icon.index)"
                class="flex-center mt-20 side-item" 
                :class="selectColor(icon.index) ? 'side-color' : ''"
            >
                <component :is="icon.icon" class="side-icon"></component>
            </div>
        </div>
    </div>
</template>

<script setup lang="js">
    import { ref, onMounted, computed, markRaw, watch } from 'vue';
    import { useStore } from 'vuex';
    import { useRouter, useRoute } from 'vue-router';
    import * as R from 'ramda';
    import { getLoginNav } from '@/api/user';
    import {
        avatar_default,
        back,
        dark,
        home,
        light,
        my,
        setting,
        updates,
        video
    } from './images';
    const store = useStore();
    const router = useRouter();
    const route = useRoute();
    const goLogin = () => {
        window.electronAPI.sendMessage('login_create');
    };
    let userInfo = computed(() => store.state.userModule.userInfo);
    const sessdata = store.state.userModule.sessdata;
    let isLight = computed(() => {
        return store.state.userModule.isLight;
    });
    const colorModeIcon = computed(() => store.state.userModule.isLight ? light : dark);
    const handleChangeBg = () => {
        store.commit('userModule/changeUserLight', !isLight.value);
        changeRootTheme();
    };
    // 对于组件不必要添加响应式可以使用markRaw避免进行深度递归仅仅监测引用的变化
    const sideTopInfo = ref([
        {route: 'home', name: '首页', index: 0, icon: markRaw(home)},
        {route: 'video', name: '精选', index: 1, icon: markRaw(video)},
        {route: 'updates', name: '动态', index: 2, icon: markRaw(updates)},
        {route: 'user', name: '我的', index: 3, icon: markRaw(my)},
    ]);
    const sideBottomInfo = ref([
      {route: '', index: 4, icon: markRaw(colorModeIcon), action: handleChangeBg},
      {route: 'setting', index: 5, icon: markRaw(setting)}
    ]);

    const changeRootTheme = () => {
        if(isLight.value) {
            document.documentElement.dataset.theme = 'light';
        }
        else {
            document.documentElement.dataset.theme = 'dark';
        };
    };

    const goPersonalSpace = () => {
        router.push('/personal-space');
    };
    const handleClickPersonalBtn = () => {
        if(store.state.userModule.isLogin) {
            goPersonalSpace();
        }
        else {
            goLogin();
        };
    };
    
    let currentIndex = ref(0);
    const updateCurIndex = index => {
        if(typeof index === 'number') {
            if(index === 4) {
                return;
            };
            currentIndex.value = index;
        };
    };
    const initCurrentIndex = () => {
        const sideInfo = [...sideTopInfo.value, ...sideBottomInfo.value];
        const side = R.find(side => side.route && R.includes(side.route, route.path))(sideInfo);
        if(side) {
            updateCurIndex(side.index);
        }
        else {
            updateCurIndex(-1);
        };
    };
    watch(() => route.path, initCurrentIndex);
    initCurrentIndex();
    let hoverIndex = ref();
    const updateHoverIndex = index => {
        if(index === currentIndex.value) {
            return;
        };
        hoverIndex.value = index;
    };
    const selectColor = index => {
        return index === hoverIndex.value || index === currentIndex.value;
    };
    const handleClickSideTopNav = index => {
        updateCurIndex(index);
        const route = sideTopInfo.value[index].route;
        router.push(`/${route}`);
    };
    const handleClickSideBottomNav = index => {
        const idx = index - sideTopInfo.value.length;
        if('action' in sideBottomInfo.value[idx]) {
            sideBottomInfo.value[idx].action();
        };
        updateCurIndex(index);
        const route = sideBottomInfo.value[idx].route;
        if(route) {
            router.push(`/${route}`);
        };
    };
    const handleMouseEnterSide = index => {
        updateHoverIndex(index);
    };
    const handleMouseLeaveSide = () => {
        updateHoverIndex(null);
    };

    const fetchLoginNav = async (sessdata) => {
        try {
            const response = await getLoginNav(sessdata);
            const result = response.data;
            const { data: { wbi_img: { img_url, sub_url } } } = result;
            const img_key = img_url.slice(
                img_url.lastIndexOf('/') + 1,
                img_url.lastIndexOf('.')
            );
            const sub_key = sub_url.slice(
                sub_url.lastIndexOf('/') + 1,
                sub_url.lastIndexOf('.')
            );
            store.commit('userModule/updateWbiKey', {img_key, sub_key});
            if(result.code === 0) {
                const { face, mid, uname, level_info: { current_level } } = result.data;
                store.commit('userModule/changeUserLoginState', true);
                store.commit('userModule/changeUserInfo', { face, mid, uname, current_level });
            }
            else {
                store.commit('userModule/changeUserLoginState', false);
                store.commit('userModule/clearSessdata');
            };
        } catch(err) {
            console.log('获取登录状态失败', err);
        };
    };

    const handleClickBackBtn = () => {
        goBack();
    };

    const goBack = () => {
        router.go(-1);
    };

    onMounted(async () => {
        changeRootTheme();
        fetchLoginNav(sessdata);
    });
</script>

<style lang="scss" scoped>
    .sidebar {
        position: fixed;
        left: 0;
        top: 0;
        width: var(--side-width);
        height: 100vh;
        background-color: var(--theme-side-bg-color);
        overflow: hidden;
        $btnColors: #409eff, #67c23a;
        color: var(--theme-text-color);
        .side-color {
            color: var(--brand-pink);
        }
        .side-top {
            height: 350px;
  
        }
        .side-placehold {
            width: 100%;
            height: 50px;
        }
        .side-bottom {
            height: 350px;
            .default {
                background-color: rgba(204, 204, 204, .5);
                border-radius: 50%;
                width: 25px;
                height: 25px;
                margin: 5px;
            }
        }
        .side-item {
            cursor: pointer;
            transition: .2s;
            &:hover {
                color: var(--brand-pink);
            }
        }
        .side-icon {
            width: 25px;
            height: 25px;
            margin: 5px;
        }
        @for $i from 1 through length($btnColors) {
            .btn-type#{$i} {
                $color: nth($btnColors, $i);
                background-color: $color; 
                color: #fff;
                &:hover {
                    background: lighten($color, 10%);
                }
                &:active {
                    background: darken($color: $color, $amount: 10%);
                }
                &:disabled {
                    background: lighten($color: $color, $amount: 20%);
                }
            }
        }
    }
</style>
<template>
    <div class="container">
        <header class="owner flex-start" v-if="isLogin">
            <img :src="userInfo.face || ''" alt="" class="avatar">
            <div class="right flex-column-between">
                <div class="user flex-start">
                    <span class="text-[16px] weight-6 mr-5">{{ userInfo.uname || '' }}</span>
                    <div v-if="levelIcon">
                        <component :is="levelIcon" class="level-icon"></component>
                    </div>
                </div>
                <div class="exit-login flex-start" @click="handleClickExitBtn">
                    <component :is="exitLoginIcon" class="exit-icon mr-5"></component>
                    <span class="text-[14px]">退出账号登录</span>
                </div>
            </div>
        </header>
        <header class="login flex pt-20 pb-20" v-else>
            <div class="login-btn radius-7 text-[13]" @click="handleClickLoginBtn">立即登录</div>
        </header>
        <div class="line"></div>
        <section class="content">
            <div class="common">
                <div class="title" style="padding-bottom: 5px;">常规设置</div>
                <div class="part">
                    <div class="subtitle">启动时颜色模式：（更改模式后将于下次启动时生效）</div>
                    <el-select 
                        v-model="themeColorIndex" 
                        :placeholder="currentThemeColor || ''"
                        :show-arrow="false"
                        @change="handleChangeThemeColorChoice"
                        v-if="themeColorOptions && themeColorOptions.length"
                    >
                        <el-option v-for="(color, index) of themeColorOptions" :key="index" :label="color.label" :value="index" />
                    </el-select>
                </div>
                <div class="part">
                    <div class="subtitle text-[15px] weight-5">字体选择：（若字体显示异常，可切换为默认字体）</div>
                    <el-select 
                        v-model="fontIndex" 
                        :placeholder="currentFont || ''"
                        :show-arrow="false"
                        @change="handleChangeFontChoice"
                        v-if="fontOptions && fontOptions.length"
                    >
                        <el-option v-for="(font, index) of fontOptions" :key="index" :label="font.label" :value="index" />
                    </el-select>
                </div>

                <div class="start-automatically flex-start part">
                    <div class="start-automatically-wrap flex-start">
                        <span 
                            class="radio-btn mr-5" 
                            :class="{'square-checked': isAutomatically}"
                            @click="handleClickAutomaticRadio"
                        >
                        </span>
                        <span class="text-[14px]">开机时自启动</span>
                    </div>
                </div>
                <div class="part">
                    <div class="subtitle">关闭主页面时：</div>
                    <el-radio-group 
                        v-model="closeMainPageIndex" 
                        @change="handleChangeCloseMainPageChoice"
                        v-if="closeMainPageOptions && closeMainPageOptions.length"
                    >
                        <el-radio 
                            class="mt-5"
                            :value="index" 
                            size="large" 
                            v-for="(item, index) of closeMainPageOptions" 
                            :key="index">{{ item.label }}
                        </el-radio>
                    </el-radio-group>
                </div>
                <div class="close-prompt part">
                    <div class="close-prompt-wrap flex-start">
                        <span 
                            class="radio-btn mr-5" 
                            :class="{'square-checked': isClosePrompt}"
                            @click="handleClickClosePromptRadio"
                        >
                        </span>
                        <span class="text-[14px]">关闭时提示</span>
                    </div>
                </div>
            </div>
        </section>
    </div>
</template>

<script setup lang="ts">
    import { computed, ref, onActivated, markRaw, onDeactivated } from 'vue';
    import { useStore } from 'vuex';
    import exitLoginIcon from '@/assets/icon/common/exit_login.svg';

    interface NavItem {
        path?: string;
        name: string;
    };

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

    const store = useStore();
    const emit = defineEmits(['updateNav']);
    const userInfo = computed(() => store.state.userModule.userInfo);
    const isLogin = computed(() => store.state.userModule.isLogin || false);
    const navItems = ref<NavItem[]>([{
        name: '设置'
    }]);
    const updateNavItems = (navItems: NavItem[]) => {
        emit('updateNav', navItems);
    };
    const images = import.meta.glob('../../assets/icon/other/*.svg', { eager: false });
    const levelIconsPath = [
        '../../assets/icon/other/level_0.svg',
        '../../assets/icon/other/level_1.svg',
        '../../assets/icon/other/level_2.svg',
        '../../assets/icon/other/level_3.svg',
        '../../assets/icon/other/level_4.svg',
        '../../assets/icon/other/level_5.svg',
        '../../assets/icon/other/level_6.svg',
    ];
    let levelIcon = ref(null);
    if('current_level' in userInfo.value) {
        const module = images[levelIconsPath[userInfo.value.current_level]];
        // markRaw不需要对组件进行深度监听
        module().then((content: any) => levelIcon.value = markRaw(content.default));
    };
    
    // 配置项
    let configData = ref<Configure | null>(null);
    let commonConfig = null;
    // 主题色
    let themeColorOptions = ref<Option[] | null>(null);
    let themeColorIndex = ref(0);
    const updateThemeColorIndex = (index: number) => themeColorIndex.value = index;
    let currentThemeColor = ref('');
    // 字体
    let fontOptions = ref<Option[] | null>(null);
    let fontIndex = ref(0);
    const updateFontIndex = (index: number) => fontIndex.value = index;
    let currentFont = ref('');
    // 开机自启动
    let isAutomatically = ref(false);
    const updateAutomaticallyState = (state: boolean) => {
        isAutomatically.value = state;
    };
    // 关闭主页面
    let closeMainPageOptions = ref<Option[] | null>(null);
    let closeMainPageIndex = ref(0);
    const updateMainPageIndex = (index: number) => closeMainPageIndex.value = index;
    // 关闭时提示
    let isClosePrompt = ref(true);
    const updateIsClosePromptState = (state: boolean) => isClosePrompt.value = state;
    // 获取设置数据并且初始化页面变量
    const getAndProcessConfigData = async () => {
        configData.value = await window.electronAPI.invoke<Configure>('get_setting');
        if(!configData.value) return;
        commonConfig = configData.value.common;
        themeColorOptions.value = commonConfig.theme.options;
        themeColorIndex.value = updateThemeColorIndex(commonConfig.theme.index);
        currentThemeColor.value = themeColorOptions.value[themeColorIndex.value].label;

        fontOptions.value = commonConfig.fontFamily.options;
        updateFontIndex(commonConfig.fontFamily.index);
        currentFont.value = fontOptions.value[fontIndex.value].label;

        updateAutomaticallyState(commonConfig.isAutomatic);

        closeMainPageOptions.value = commonConfig.closeMain.options;
        updateMainPageIndex(commonConfig.closeMain.index);

        updateIsClosePromptState(commonConfig.isShowCloseMainPrompt);
    };

    const handleChangeThemeColorChoice = (index: number) => {
        updateThemeColorIndex(index);
        if(!themeColorOptions.value) return;
        if(!configData.value) return;
        currentThemeColor.value = themeColorOptions.value[themeColorIndex.value].label;
        configData.value.common.theme.index = themeColorIndex.value;
        const data = JSON.stringify(configData.value);
        window.electronAPI.sendMessage('main_set_setting', data);
    };

    const handleChangeFontChoice = (index: number) => {
        updateFontIndex(index);
        if(!fontOptions.value) return;
        if(!configData.value) return;
        currentFont.value = fontOptions.value[fontIndex.value].label;
        configData.value.common.fontFamily.index = fontIndex.value;
        const data = JSON.stringify(configData.value);
        window.electronAPI.sendMessage('main_set_setting', data);
        window.electronAPI.sendMessage('update_font', JSON.stringify({ fontIndex: fontIndex.value, windowId: 'video' }));
    };

    const handleClickAutomaticRadio = () => {
        updateAutomaticallyState(!isAutomatically.value);
        if(!configData.value) return;
        configData.value.common.isAutomatic = isAutomatically.value;
        const data = JSON.stringify(configData.value);
        window.electronAPI.sendMessage('main_set_setting', data);
        window.electronAPI.sendMessage('main_update_automatic', isAutomatically.value);
    };

    const handleChangeCloseMainPageChoice = (index: number) => {
        updateMainPageIndex(index);
        if(!configData.value) return;
        configData.value.common.closeMain.index = closeMainPageIndex.value;
        const data = JSON.stringify(configData.value);
        window.electronAPI.sendMessage('main_set_setting', data);
    };

    const handleClickClosePromptRadio = () => {
        updateIsClosePromptState(!isClosePrompt.value);
        if(!configData.value) return;
        configData.value.common.isShowCloseMainPrompt = isClosePrompt.value;
        const data = JSON.stringify(configData.value);
        window.electronAPI.sendMessage('main_set_setting', data);
    };

    const exitLogin = () => {
        store.commit('userModule/changeUserLoginState', false);
        store.commit('userModule/clearSessdata');
        window.location.reload();
    };

    const handleClickExitBtn = () => {
        exitLogin();
    };

    const goLogin = () => {
        window.electronAPI.send('login_create');
    };

    const handleClickLoginBtn = () => {
        goLogin();
    };

    onActivated(async () => {
        updateNavItems(navItems.value);
        await getAndProcessConfigData();
    });
    onDeactivated(() => {
    });
</script>

<style lang="scss" scoped>
    .container {
        padding: 0 20px;
        box-sizing: border-box;
        .owner {
            padding: 20px 0;
            height: 70px;
            .avatar {
                margin-right: 10px;
                width: 70px;
                height: 70px;
                border-radius: 50%;
            }
            .right {
                color: var(--theme-text-color);
                height: 100%;
                .user {
                    white-space: nowrap;
                    .level-icon {
                        width: 40px;
                        height: 40px;
                        vertical-align: top;
                    }
                }
                .exit-login {
                    color: var(--brand-pink);
                    cursor: pointer;
                    .exit-icon {
                        width: 15px;
                        height: 15px;
                    }
                }
            }
        }
        .login {
            .login-btn {
                padding: 7px 20px;
                color: #fff;
                background-color: rgba(255, 102, 153, .9);
                transition: .2s;
                &:hover {
                    background-color: rgba(255, 102, 153, .5);
                }
            }
        }
  
        .line {
            height: 1px;
            width: 100%;
            background-color: var(--line-color);
        }
        .content {
            .el-select {
                width: 180px;
                :deep(.el-select__wrapper) {
                    border: 1px solid var(--line-color);
                    box-shadow: none;
                    background-color: var(--bg3-float);
                    .el-select__placeholder {
                        color: var(--theme-text-color);
                    }
                    .el-select__placeholder.is-transparent {
                        color: var(--theme-subtitle-color);
                    }
                }
                :deep(.el-select__wrapper.is-hovering:not(.is-focused)) {
                    box-shadow: none !important;
                    background-color: var(--bg2-float);
                }
                :deep(.el-select__wrapper.is-focused) {
                    box-shadow: none !important;
                }
            }
            .el-radio-group {
                display: flex;
                flex-direction: column;
                justify-content: center;
                align-items: flex-start;
                :deep(.el-radio) {
                    height: auto;
                   /* 1. 针对 checked 状态的伪元素 */
                    .el-radio__original:checked + .el-radio__inner::before {
                        content: "";
                        position: absolute;
                        left: 50%;
                        top: 50%;
                        transform: translate(-50%, -50%);
                        width: 70%;
                        height: 70%;
                        background-color: var(--brand-pink);
                        border-radius: 50%;
                    }
                    /* 2. 针对 checked 状态的边框 */
                    .el-radio__original:checked + .el-radio__inner {
                        border: var(--brand-pink) 1px solid;
                    }
                    /* 3. 鼠标悬停时的边框样式 */
                    &:hover .el-radio__inner {
                        border: var(--brand-pink) 1px solid;
                    }
                    /* 4. 默认的内部样式 */
                    .el-radio__inner {
                        position: relative;
                        border: var(--line-color) 1px solid;
                        transition: 0.2s;
                        background: transparent;
                    }
                    /* 5. 默认情况下的伪元素 */
                    .el-radio__inner::after {
                        content: none;
                    }
                    /* 6. 默认的标签样式 */
                    .el-radio__label {
                        color: var(--theme-text-color) !important;
                    }
                }
            }
            .common {
                color: var(--theme-text-color);
                .title {
                    font-size: 14px;
                    font-weight: 600;
                    padding: 15px 0;
                }
                .part {
                    padding: 7px 0;
                }
                .subtitle {
                    font-size: 14px;
                    font-weight: 500;
                    padding: 10px 0;
                }
                .start-automatically {
                    cursor: pointer;
                    .start-automatically-wrap:not(.square-checked):hover .radio-btn {
                        border: 1px solid var(--brand-pink);
                    }
                }
                .close-prompt {
                    cursor: pointer;
                    .close-prompt-wrap:not(.square-checked):hover .radio-btn {
                        border: 1px solid var(--brand-pink);
                    }
                }
  
                .radio-btn {
                    width: 17px;
                    height: 17px;
                    border: 1px solid var(--line-color);
                    transition: .2s;
                    box-sizing: border-box;
                    cursor: pointer;
                }
                .square-checked {
                    position: relative;
                    background-color: var(--brand-pink);
                    &::after {
                        content: "✓"; /* 设置对勾标记 */
                        position: absolute;
                        left: 50%;
                        top: 50%;
                        transform: translate(-50%, -50%);
                        display: flex;
                        justify-content: center;
                        align-items: center;
                        width: calc(100% + 2px);
                        height: calc(100% + 2px);
                        background: transparent;
                        color: white;
                        font-weight: 600;
                        font-size: 14px;
                    }
                }
            }
        }
    }
</style>
<style lang="scss">
    .el-select__popper.el-popper {
        background-color: var(--bg3-float);
        border: 1px solid var(--line-color);
        color: var(--select-color);
        .el-select-dropdown__item {
            color: inherit;
            margin: 5px 0;
            box-sizing: border-box;
            transition: .2s;
        }
        .el-select-dropdown__item.is-hovering {
            background-color: rgba(121, 127, 135, .2);
        }
        .el-select-dropdown__item.is-selected {
            background-color: rgba(121, 127, 135, .2);
            font-weight: normal;
        }
        .el-popper__arrow {
            display: none;
        }
    }
</style>
<template>
    <div class="container radius-10" :class="isInFocus ? 'background-close' : 'background-open'">
        <div class="content  flex-column">
            <div class="close flex-1 flex-end">
                <div class="close-btn" @click="closeLoginView">
                    <img :src="close_png" alt="">
                </div>
            </div>
            <section class="flex-around flex-7 pt-10 pb-10 login-content">
                <div class="qrcode-content flex-column flex-center flex-2">
                    <header class="text-[16px] flex-1">扫描二维码登录</header>
                    <section class="qr-section flex-column flex-center mt-10 flex-9">
                        <canvas id="qrCode" class="mb-15"></canvas>
                        <footer class="text-[14px]">
                            <div>请使用 <span class="text-[12px]">哔哩哔哩登录客户端</span></div>
                            <div>扫码登录或扫码下载APP</div>
                        </footer>
                    </section>
                </div>
                <div class="account-content flex-3">
                    <header class="flex-center mb-20 text-[16px]">
                        <span @click="handleClickLoginOptionBtn(0)" class="pr-20 head-line" :class="loginOption === 0 ? 'active-tab' : ''">密码登录</span>
                        <span @click="handleClickLoginOptionBtn(1)" class="pl-20" :class="loginOption === 1 ? 'active-tab' : ''">短信登陆</span>
                    </header>
                    <section v-if="loginOption === 0">
                        <section class="login-main mb-20 mt-20 radius-10 text-[14px]">
                            <div class="login-input flex-center flex-start">
                                <span class="mr-20">账号</span>
                                <input type="text" placeholder="请输入账号" class="flex-1" maxlength="20">
                            </div>
                            <div class="middle-line"></div>
                            <div class="login-input flex-center flex-start" >
                                <span class="mr-20">密码</span>
                                <input :type="isShowPassword ? 'text' : 'password'" placeholder="请输入密码" class="flex-3" maxlength="20" @focus="handleFocusInp" @blur="handleBlurInp">
                                <div class="flex-2 flex-center">
                                    <div class="mr-10 eye-btn" @click="changePasswordInp">
                                        <svg data-v-1932284b="" width="20" height="20" viewBox="0 0 20 20" fill="none" xmlns="http://www.w3.org/2000/svg">
                                            <path data-v-1932284b="" v-if="!isShowPassword" class="svg-btn" fill-rule="evenodd" clip-rule="evenodd" d="M17.5753 6.85456C17.7122 6.71896 17.8939 6.63806 18.0866 6.63806C18.7321 6.63806 19.0436 7.42626 18.5748 
                                            7.87006C18.1144 8.30554 17.457 8.69885 16.6478 9.03168L18.1457 10.5296C18.2101 10.5941 18.2613 10.6706 18.2962 10.7548C18.331 10.839 18.349 10.9293 18.349 11.0204C18.349 
                                            11.1116 18.331 11.2019 18.2962 11.2861C18.2613 11.3703 18.2101 11.4468 18.1457 11.5113C18.0812 11.5757 18.0047 11.6269 17.9205 11.6618C17.8363 11.6967 17.746 11.7146 17.6548 
                                            11.7146C17.5637 11.7146 17.4734 11.6967 17.3892 11.6618C17.305 11.6269 17.2284 11.5757 17.164 11.5113L15.3409 9.68819C15.2898 9.63708 15.247 9.57838 15.2141 9.51428C14.4874 
                                            9.71293 13.6876 9.87122 12.8344 9.98119C12.8363 9.99011 12.8381 9.99908 12.8397 10.0081L13.2874 12.5472C13.315 12.7266 13.2713 12.9098 13.1656 13.0573C13.0598 13.2049 12.9005 
                                            13.3052 12.7217 13.3367C12.5429 13.3683 12.3589 13.3285 12.2091 13.2259C12.0592 13.1234 11.9555 12.9663 11.9202 12.7882L11.4725 10.2491C11.4645 10.2039 11.4611 10.1581 11.4621 
                                            10.1125C10.9858 10.1428 10.4976 10.1586 10.0002 10.1586C9.57059 10.1586 9.14778 10.1468 8.73362 10.1241C8.73477 10.1656 8.7322 10.2074 8.72578 10.249L8.27808 12.7881C8.24612 
                                            12.9694 8.14345 13.1306 7.99265 13.2362C7.84186 13.3418 7.65528 13.3831 7.47398 13.3512C7.29268 13.3192 7.1315 13.2166 7.0259 13.0658C6.9203 12.915 6.87892 12.7284 6.91088 
                                            12.5471L7.35858 10.008C7.35877 10.007 7.35896 10.0061 7.35915 10.0052C6.50085 9.90284 5.6941 9.75191 4.95838 9.56025C4.93012 9.60634 4.89634 9.64933 4.85748 9.68819L3.03438 
                                            11.5113C2.96992 11.5757 2.8934 11.6269 2.80918 11.6618C2.72496 11.6967 2.63469 11.7146 2.54353 11.7146C2.45237 11.7146 2.36211 11.6967 2.27789 11.6618C2.19367 11.6269 2.11714 
                                            11.5757 2.05268 11.5113C1.98822 11.4468 1.93709 11.3703 1.90221 11.2861C1.86732 11.2019 1.84937 11.1116 1.84937 11.0204C1.84937 10.9293 1.86732 10.839 1.90221 10.7548C1.93709 
                                            10.6706 1.98822 10.5941 2.05268 10.5296L3.49373 9.08855C2.6197 8.744 1.91247 8.33062 1.42559 7.87006C0.956591 7.42636 1.26799 6.63816 1.91359 6.63816C2.10629 6.63816 2.28789 
                                            6.71896 2.42489 6.85456C2.70009 7.12696 3.19529 7.45886 3.98459 7.77796C5.54429 8.40856 7.73699 8.77016 10.0001 8.77016C12.2632 8.77016 14.4558 8.40856 16.0156 7.77796C16.8049 
                                            7.45886 17.3001 7.12696 17.5753 6.85456Z" fill="#9499A0">
                                            </path>
                                            <path data-v-1932284b="" v-else class="svg-btn" fill-rule="evenodd" clip-rule="evenodd" d="M2.11069 9.43732C3.21647 7.77542 5.87904 4.58331 9.89458 4.58331C13.8801 4.58331 16.6483 7.72502 17.8345 
                                            9.4049C18.0905 9.76747 18.0905 10.2325 17.8345 10.5951C16.6483 12.2749 13.8801 15.4166 9.89458 15.4166C5.87904 15.4166 3.21647 12.2245 2.11069 10.5626C1.88009 10.2161 1.88009 
                                            9.7839 2.11069 9.43732ZM9.89458 3.33331C5.19832 3.33331 2.20919 7.03277 1.07001 8.74489C0.560324 9.51091 0.560323 10.4891 1.07001 11.2551C2.20919 12.9672 5.19832 16.6666 9.89458 
                                            16.6666C14.5412 16.6666 17.6368 13.0422 18.8556 11.3161C19.4168 10.5213 19.4168 9.4787 18.8556 8.68391C17.6368 6.95774 14.5412 3.33331 9.89458 3.33331ZM7.29165 9.99998C7.29165 
                                            8.50421 8.50421 7.29165 9.99998 7.29165C11.4958 7.29165 12.7083 8.50421 12.7083 9.99998C12.7083 11.4958 11.4958 12.7083 9.99998 12.7083C8.50421 12.7083 7.29165 11.4958 7.29165 
                                            9.99998ZM9.99998 6.04165C7.81385 6.04165 6.04165 7.81385 6.04165 9.99998C6.04165 12.1861 7.81385 13.9583 9.99998 13.9583C12.1861 13.9583 13.9583 12.1861 13.9583 9.99998C13.9583 
                                            7.81385 12.1861 6.04165 9.99998 6.04165Z" fill="#9499A0">
                                            </path>
                                        </svg>
                                    </div>
                                    <div class="forget-btn">忘记密码?</div>
                                </div>
                            </div>
                        </section>
                        <footer class="flex-around">
                            <div class="resigist-btn flex-1 mr-20 btn-2">注册</div>
                            <div class="login-btn flex-1 btn-1">登录</div>
                        </footer>
                    </section>

                    <section v-if="loginOption === 1 && countryList" >
                        <section class="login-main mb-20 mt-20 radius-10 text-[14px]" >
                            <div class="login-input flex-center flex-start">
                                <el-input
                                    v-model="telPhone"
                                    placeholder="请输入手机号"
                                    class="input-with-select flex"
                                    type="tel"
                                    >
                                    <template #prepend>
                                        <el-select v-model="countrySelect">
                                            <el-option 
                                                :label="`+${country.country_id}`"
                                                :value="country.id"
                                                v-for="country of countryList.common" 
                                                :key="country.id"
                                            >
                                                <!-- 自定义选项的内容 -->
                                                <template #default>
                                                    <div class="flex-between" style="width: 200px;">
                                                        <span>{{ country.cname }}</span>
                                                        <span>+{{ country.country_id }}</span>
                                                    </div>
                                                </template>
                                            </el-option>
                                        </el-select>
                                    </template>
                                    <template #append>
                                        <div @click="fetchLoginCaptcha" v-if="waitCodeTime === 0" :class="isTrulyPhone ? '' : 'disable-btn'">获取验证码</div>
                                        <div v-else class="disable-btn">重新发送({{ waitCodeTime }})</div>
                                    </template>
                                </el-input>
                            </div>
                            <div class="middle-line"></div>
                            <div class="login-input flex-center flex-start" >
                                <span class="mr-15 flex-2">验证码</span>
                                <input class="flex-8" type="number" placeholder="请输入验证码" maxlength="10" v-model="shortMessageCode" @focus="handleFocusInp" @blur="handleBlurInp">
                            </div>
                        </section>
                        <footer class="flex-center pl-10 pr-10">
                            <div class="login-btn flex-1 btn-1" @click="fetchLoginSms">登录/注册</div>
                        </footer>
                    </section>
                </div>
            </section>
            <footer class="text-[14px] flex-2 flex-column-center">
                <div>未注册过哔哩哔哩的手机号, 我们将自动帮你注册账号</div>
                <div>登录或完成注册即代表你同意 <span>用户协议</span> 和 <span>隐私政策</span></div>
            </footer>
        </div>
        <div id="area" v-if="isInCaptcha"></div>
    </div>
</template>

<script setup lang="ts">
    import { ref, onMounted, onUnmounted } from 'vue';
    import usePhoneVerification from '@/login_views/usePhoneVerification';
    import useQRCodeVerification from '@/login_views/useQRCodeVerification';
    import close_png from '@/assets/icon/common/close.png';

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

    interface Configure {
        common: CommonConfig,
    }

    let isInFocus = ref(false);
    const handleFocusInp = () => {
        isInFocus.value = true;
    };
    const handleBlurInp = () => {
        isInFocus.value = false;
    };

    const isShowPassword = ref(false);
    const loginOption = ref(1);

    const updateLoginOption = (option: number) => {
        loginOption.value = option;
    };
    const handleClickLoginOptionBtn = async (option: number) => {
        updateLoginOption(option);
        await fetchCountryList();
    };
    const changePasswordInp = () => {
        isShowPassword.value = !isShowPassword.value;
    };

    const closeLoginView = () => {
        window.electronAPI.send('login_exit');
    };
    const {
        countryList,
        countrySelect,
        fetchCountryList,
    
        isInCaptcha,
        waitCodeTime,
        shortMessageCode,
        fetchLoginCaptcha,
    
        telPhone,
        isTrulyPhone,
    
        fetchLoginSms
    } = usePhoneVerification();
    
    useQRCodeVerification();

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

    const removeFontListener = window.electronAPI.receive('update_font_to_login', (message) => {
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
    onMounted(async () => {
        await initSystemConfiguration();
        await fetchCountryList();
    });
    onUnmounted(() => {
        if(removeFontListener) {
            (removeFontListener as () => void)();
        };
    });
</script>
<style lang="scss" scoped>
input[type=number]::-webkit-inner-spin-button,
input[type=number]::-webkit-outer-spin-button {
    -webkit-appearance: none;
    margin: 0;
}
$btnColors: #FF6699, grey;
.container {
    position: relative;
    width: 830px;
    height: 450px;
    box-sizing: border-box;
    background-color: #fff;
    padding: 40px 50px;
    -webkit-app-region: drag;
    -webkit-user-select: none;
    user-select: none;
    box-shadow: 0px 0px 10px 10px rgba(0, 0, 0, 0.1);
    .content {
        width: 100%;
        height: 100%;
        -webkit-app-region: no-drag;
        .close {
            height: 20px;
            .close-btn {
                width: 32px;
                height: 32px;
                cursor: pointer;
                img {
                    width: 100%;
                    height: 100%;
                }
            }
        }
        .login-content {
            overflow: hidden;
            .qrcode-content {
                position: relative;
                overflow: hidden;
                padding: 0 20px 0;
                box-sizing: border-box;
                .qr-section {
                    width: 100%;
                    border-right: 1px solid #ccc;
                    #qrCode {
                        width: 150px;
                        height: 150px;
                    }
                }
            }
            .account-content {
                padding: 0 20px 0;
                box-sizing: border-box;

                .head-line {
                    border-right: 1px solid #ccc; 
                    box-sizing: border-box;
                }
                .active-tab {
                    color: var(--brand-pink);
                }
                .login-main {
                    border: 1px solid #ccc;
                    .middle-line {
                        height: 1px; 
                        width: 100%; 
                        background-color: #ccc;
                    }
                    .login-input {
                        margin: 0 15px;
                        height: 55px;
                        .eye-btn {
                            width: 20px;
                            height: 20px;
                            &:hover .svg-btn {
                                fill: var(--brand-pink);
                            }
                            .svg-btn {
                                transition: .3s;
                            }
                        }
                        .forget-btn:hover {
                            color: var(--brand-pink);
                        }
                        
                        .input-with-select {
                            :deep(.el-input-group__prepend) {
                                flex: 2;
                                padding: 0;
                                background-color: #fff;
                                box-shadow: none;
                                margin-right: 15px;
                                .el-select {
                                    box-shadow: none;
                                    .el-select__wrapper {
                                        box-shadow: none;
                                    }
                                }
                            }
                            :deep(.el-input__wrapper) {
                                flex: 5;
                                padding: 0;
                                background-color: #fff;
                                box-shadow: none;
                                .el-input__wrapper {
                                    box-shadow: none;
                                }
                            }
                            :deep(.el-input-group__append) {
                                flex: 3;
                                padding: 0;
                                background-color: #fff;
                                box-shadow: none;
                                border-left: 1px solid #ccc;
                            }
                            :deep(.el-select) div {
                                padding: 0;
                            }
                            .disable-btn {
                                color: #ccc;
                                cursor: not-allowed;
                            }
                        }
               
                        input {
                            padding: 5px 0;
                            border: none;
                            background: none;
                            outline: none;
                            height: 15px;
                            font-size: 12px;
                        }
                    }
                }
                .resigist-btn {
                    padding: 10px 0;
                    text-align: center;
                    border-radius: 10px;
                    border: 1px solid #ccc;
                    box-sizing: border-box;
                    cursor: pointer;
                }
                .login-btn {
                    padding: 10px 0;
                    text-align: center;
                    border-radius: 10px;
                    cursor: pointer;
                }
                @for $i from 1 through length($btnColors) {
                    .btn-#{$i} {
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
        }
    }
    #area {
        position: absolute;
        left: 50%;
        top: 50%;
        transform: translateX(-50%) translateY(-50%);
        width: 200px;
        height: 200px;
    }
}
.background-open {
    background-image: url('@/assets/login/22_open.4ea5f239.png'), url('@/assets/login/33_open.f7d7f655.png');
    background-position: 0 100%, 100% 100%;
    background-repeat: no-repeat, no-repeat;
    background-size: 14%;
}
.background-close {
    background-image: url('@/assets/login/22_close.9382a5a8.png'), url('@/assets/login/33_close.a8c18fc8.png');
    background-position: 0 100%, 100% 100%;
    background-repeat: no-repeat, no-repeat;
    background-size: 14%;
}

</style>
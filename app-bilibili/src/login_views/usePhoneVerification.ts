import { ref, computed, watch, onUnmounted } from 'vue';
import { useStore } from 'vuex';
import { AxiosResponse } from 'axios';
import { ElMessage } from 'element-plus';
import * as R from 'ramda';
import debounce from '@/utils/common/debounce';
import { isPhone } from '@/utils/common/isPhone';
import { getLoginCaptcha, getLoginSmsCaptchaKey, getLoginSms, getCountryList } from '@/api/login/index';
import showAlert from '@/utils/showAlert';

interface Country {
    id: number;
    country_id: string;
    cname: string
};
  
interface CountryList {
    common: Country[];
};

interface CaptchaResponse {
    geetest: {
        gt: string;
        challenge: string;
    };
    token: string;
};
  
export default function usePhoneVerification() {
    const store = useStore();
    const countryList = ref<CountryList | null>(null);
    const countrySelect = ref<number>(1);
    
    const countryId = computed<string | null>(() => {
      if (countryList.value && 'common' in countryList.value && countryList.value.common.length) {
        const country = R.find(R.propEq(countrySelect.value, 'id'), countryList.value.common);
        return country ? country.country_id : '';
      };
      return null;
    });
  
    const fetchCountryList = async (): Promise<void> => {
        if(countryList.value) return;
        const result: AxiosResponse = await getCountryList();
        if (result.data.code === 0) countryList.value = result.data.data;
    };
  
    const telPhone = ref<string | null>(null);
    const isTrulyPhone = ref<boolean>(false);
  
    const debouncePhone = debounce(() => {
      if (telPhone.value) {
        isTrulyPhone.value = isPhone(telPhone.value); // Assuming `isPhone` is already typed
      }
    }, 300);
  
    const stopTelWatcher = watch(telPhone, debouncePhone);
  
    const isInCaptcha = ref<boolean>(false);
    const waitCodeTime = ref<number>(0);
    const waitDuringTime = 60;
  
    let waitCodeTimer: NodeJS.Timeout | null = null;
  
    const fetchLoginCaptcha = async (): Promise<void> => {
        if (!isTrulyPhone.value) {
            showAlert('手机号格式错误');
            return;
        };
        if (isInCaptcha.value) {
            return;
        };
  
        const captchaPromsie = async (): Promise<void> => {
            return new Promise((resolve, reject) => {
                getLoginCaptcha().then((res: AxiosResponse) => {
                    const data_geetest: CaptchaResponse = res.data.data;
                    const { gt, challenge } = data_geetest.geetest;
                    const token = data_geetest.token;
                    changeCaptchaState(true);
        
                    initGeetest({
                        gt,
                        challenge,
                        offline: false,
                        new_captcha: true,
                        product: 'bind',
                        area: '#area',
                        next_width: '200px',
                        https: true,
                    }, (captchaObj: any) => { // Add appropriate types for `captchaObj`
                    captchaObj.onReady(() => captchaObj.verify())
                        .onSuccess(async () => {
                            const validate = captchaObj.getValidate().geetest_validate;
                            const seccode = captchaObj.getValidate().geetest_seccode;
                            const response: AxiosResponse = await getLoginSmsCaptchaKey({
                                cid: countryId.value || '',
                                tel: telPhone.value || '',
                                source: 'main-fe-header',
                                token,
                                challenge,
                                validate,
                                seccode
                            });
                            waitCodeTime.value = waitDuringTime;
                            waitCodeTimer = setInterval(() => {
                                if (waitCodeTime.value > 0) {
                                    waitCodeTime.value--;
                                } else {
                                    waitCodeTime.value = 0;
                                    clearInterval(waitCodeTimer as NodeJS.Timeout);
                                    waitCodeTimer = null;
                                }
                            }, 1000);
                            changeCaptchaState(false);
                            if (response.data.code === 0) {
                                captcha_key.value = response.data.data.captcha_key;
                                resolve();
                            } else {
                                reject(response.data.message);
                            }
                        })
                        .onClose(() => {
                            changeCaptchaState(false);
                            resolve();
                        })
                        .onError(() => {
                            changeCaptchaState(false);
                            reject('获取验证码出错, 请刷新重试');
                        });
                    });
                });
            });
        };  
  
        try {
            await captchaPromsie();
        } catch (error: any) {
            console.log(error);
            ElMessage({
                type: 'error',
                message: error.message || '获取短信异常', 
                offset: 40
            });
        };
    };
  
    const shortMessageCode = ref<string | null>(null);
    const captcha_key = ref<string | null>(null);
  
    const fetchLoginSms = async (): Promise<void> => {
      try {
        if (!isTrulyPhone.value || !shortMessageCode.value) {
            throw new Error('请填写信息');
        }
        const response: AxiosResponse = await getLoginSms({
            cid: countryId.value || '',
            tel: telPhone.value || '',
            source: 'main-fe-header',
            captcha_key: captcha_key.value || '',
            code: Number(shortMessageCode.value),
        });
        shortMessageCode.value = '';
        if (response.data.code == 0) {
            store.commit('userModule/updateSessdata', response.data.sessdata);
            telPhone.value = '';
            window.electronAPI.sendMessage('vuex_update_from_login', JSON.stringify({ sessdata: response.data.sessdata, windowId: 'video' }));
            window.electronAPI.sendMessage('login_exit');
        } else {
            throw new Error(response.data.message);
        };
      } catch (error: any) {
        ElMessage({
            type: 'error',
            message: error.message || '获取短信异常', 
            offset: 40
        });
      };
    };
  
    const changeCaptchaState = R.curry((flag: boolean) => isInCaptcha.value = flag);
  
    onUnmounted(() => {
      if (waitCodeTimer) {
        clearInterval(waitCodeTimer);
        waitCodeTimer = null;
      };
      stopTelWatcher();
    });
    return {
        countryList,
        countrySelect,
        countryId,
        fetchCountryList,
    
        isInCaptcha,
        waitCodeTime,
        waitDuringTime,
        waitCodeTimer,
        shortMessageCode,
        captcha_key,
        fetchLoginCaptcha,
        changeCaptchaState,
    
        telPhone,
        isTrulyPhone,
        debouncePhone,
    
        fetchLoginSms
    };
};




import { get, post } from '../http';
import type { QRCodePollReq, LoginSmsCaptchaKeyReq, LogimSmsReq } from './type';
const getQRCode = async () => {
    return await get({
        url: '/user/qrcode_generate'
    });
};
const getQRCodePoll = async (data: QRCodePollReq) => {
    return await get({
        url: '/user/qrcode_poll',
        data
    });
};
const getLoginCaptcha = async () => {
    return await get({
        url: '/user/login/captcha'
    });
};
const getLoginSmsCaptchaKey = async (data: LoginSmsCaptchaKeyReq) => {
    return await post({
        url: '/user/login/sms/send',
        data
    });
};
const getLoginSms = async (data: LogimSmsReq) => {
    return await post({
        url: '/user/login/sms',
        data
    });
};
const getCountryList = async () => {
    return await get({
        url: '/user/country/list'
    });
};
export {
    getQRCode,
    getQRCodePoll,
    getLoginCaptcha,
    getLoginSmsCaptchaKey,
    getLoginSms,
    getCountryList
};
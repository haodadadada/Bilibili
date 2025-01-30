export interface QRCodePollReq {
    qrcode_key: string,
    source: string
};

export interface LoginSmsCaptchaKeyReq {
    cid: string,
    tel: string,
    source: string,
    token: string,
    challenge: unknown,
    validate: unknown,
    seccode: unknown
};

export interface LogimSmsReq {
    cid: string,
    tel: string,
    source: string,
    captcha_key: string,
    code: number
};
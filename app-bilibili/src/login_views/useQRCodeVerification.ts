import { onMounted } from 'vue';
import { useStore } from 'vuex';
import QRCode from 'qrcode';
import * as R from 'ramda';
import { 
    getQRCode, 
    getQRCodePoll, 
} from '../api/login';


interface QRCodePollResponse {
    data: {
        data: {
            code: number;
            url: string;
            [key: string]: any;
        };
        [key: string]: any;
    };
    [key: string]: any;
}

export default function useQRCodeVerification() {
    const store = useStore();
    
    const fetchQRCode = R.curry(async (
        getQRCodeFn: () => Promise<any>, 
        generateQRCodeFn: (url: string, callback: (error: Error | null | undefined) => void) => void, 
        varifyQRCodeLoginFn: (qrCodeKey: string) => Promise<boolean>
    ) => {
        try {
            const result = await getQRCodeFn();
            if (result.data.code === 0) {
                const resultQRUrl = result.data.data.url;
                const qrCodeKey = result.data.data.qrcode_key;
                await new Promise<void>((resolve, reject) => 
                    generateQRCodeFn(resultQRUrl, (error) => error ? reject(new Error('生成二维码失败')) : resolve())
                );
                retryFn(varifyQRCodeLoginFn, 1000, qrCodeKey);
            } else {
                throw new Error(result.data.message);
            };
        } catch (error: any) {
            ElMessage.error(error.message || '二维码获取异常');
        };
    });
    
    const generateQRCode = (url: string, callback: (error: Error | null | undefined) => void) => {
        QRCode.toCanvas(
            document.getElementById('qrCode') as HTMLCanvasElement, 
            url, 
            { width: 150 }, 
            callback
        );
    };

    const varifyQRCodeLogin = async (qrCodeKey: string): Promise<boolean> => {
        const result = await getQRCodePoll({ qrcode_key: qrCodeKey, source: 'main-fe-header' }) as QRCodePollResponse;
        if (result.data.data.code === 0) {
            const url = result.data.data.url;
            const params = new URLSearchParams(url);
            const SESSDATA = params.get('SESSDATA');
            if (SESSDATA) {
                store.commit('userModule/updateSessdata', SESSDATA);
                window.electronAPI.sendMessage('vuex_update_from_login', { sessdata: SESSDATA });
                window.electronAPI.sendMessage('login_exit');
                return true;
            };
        };
        return false;
    };

    let qrTimer: NodeJS.Timeout | null = null;

    const retryFn = async (
        fn: (...args: any[]) => Promise<boolean>, 
        during: number = 1000, 
        ...args: any[]
    ) => {
        const maxRetry = 20;
        let retryTimes = 0;
        qrTimer = setInterval(async () => {
            try {
                const result = await fn(...args);
                if (result || retryTimes >= maxRetry) {
                    clearInterval(qrTimer!);
                    qrTimer = null;
                }
                retryTimes++;
            } catch (err) {
                clearInterval(qrTimer!);
                qrTimer = null;
                console.log('retryFn', err);
            }
        }, during);
    };

    onMounted(async () => {
        await fetchQRCode(getQRCode, generateQRCode, varifyQRCodeLogin);
    });

    return {};
}


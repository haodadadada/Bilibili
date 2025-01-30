import axios, { AxiosError, AxiosRequestConfig, AxiosResponse, ResponseType } from 'axios';
import { ElMessage } from 'element-plus';
import { isFormData } from '../utils/common/isFormData';

// 定义 Option 的类型
interface RequestOption {
    url: string;
    data?: unknown;
    headers?: Record<string, string>;
    header?: string;
    responseType?: ResponseType;
};

const request = axios.create({
    baseURL: import.meta.env.VITE__ENV === 'development' ? '/webapi' : import.meta.env.VITE_API_BASE_URL + '/webapi',
    timeout: 10000
});

// GET 请求类型
const get = async <T>(option: RequestOption): Promise<AxiosResponse<T>> => {
    try {
        const config: AxiosRequestConfig = {
            method: 'get',
            url: option.url,
            params: option.data,
            headers: {
                'Content-Type': option.header || 'application/json; charset=utf-8',
                ...option.headers
            },
            responseType: option.responseType || 'json'
        };
        const result = await request(config);
        return result;
    } catch (err: unknown) {
        handleError(err);
        if (err instanceof AxiosError) {
            // 强制断言 response.data 为特定类型
            const responseData = err.response?.data as { message?: string };
            if(responseData && 'message' in responseData) {
                throw new Error(responseData.message);
            }
            else if(responseData) {
                throw new Error(JSON.stringify(responseData));
            }
            else {
                throw new Error('未知错误');
            };
        } else if (err instanceof Error) {
            throw new Error(err.message);
        } else {
            throw new Error('An unknown error');
        };
    };
};

// POST 请求类型
const post = async (option: RequestOption): Promise<AxiosResponse<unknown>> => {
    try {
        const config: AxiosRequestConfig = {
            method: 'post',
            url: option.url,
            headers: {
                'Content-Type': option.header || 'application/x-www-form-urlencoded',
                ...option.headers
            },
            data: option.data,
            responseType: option.responseType || 'json'
        };

        let result: AxiosResponse<unknown>;
        if (isFormData(option.data)) {
            result = await request({
                ...config,
                data: option.data
            });
        } else {
            result = await request(config);
        }
        return result;
    } catch (err: unknown) {
        handleError(err);
        if (err instanceof AxiosError) {
            // 强制断言 response.data 为特定类型
            const responseData = err.response?.data as { message?: string };
            if(responseData && 'message' in responseData) {
                throw new Error(responseData.message);
            }
            else if(responseData) {
                throw new Error(JSON.stringify(responseData));
            }
            else {
                throw new Error('未知错误');
            };
        } else if (err instanceof Error) {
            throw new Error(err.message);
        } else {
            throw new Error('An unknown error');
        };
    }
};

// 错误处理函数
const handleError = (err: unknown) => {
    // 首先检查是否为 AxiosError 类型
    if (err instanceof AxiosError) {
        if (err.response) {
            // 请求已发出且服务器响应了状态码范围在 2xx 之外
            switch (err.response.status) {
                case 500:
                    ElMessage({
                        type: 'error',
                        message: '服务器繁忙请稍后再试', 
                        offset: 40
                    });
                    break;
                case 404:
                    ElMessage({
                        type: 'error',
                        message: '请求的资源未找到', 
                        offset: 40
                    });
                    break;
                case 401:
                    ElMessage({
                        type: 'error',
                        message: '未授权，请登录', 
                        offset: 40
                    });
                    break;
                case 400:
                    ElMessage({
                        type: 'error',
                        message: '请求错误，请检查输入', 
                        offset: 40
                    });
                    break;
                default: {
                    // 使用类型断言处理 response.data.message
                    const message = (err.response.data as { message?: string })?.message;
                    ElMessage({
                        type: 'error',
                        message: message || '未知错误', 
                        offset: 40
                    });
                    break;
                };
            };
        } else if (err.request) {
            // 请求已发出但没有收到响应
            ElMessage({
                type: 'error',
                message: '服务器无响应，请检查网络', 
                offset: 40
            });
        }
    } else if (err instanceof Error) {
        // 处理非 Axios 错误
        ElMessage({
            type: 'error',
            message: err.message || '未知错误', 
            offset: 40
        });
    } else {
        ElMessage({
            type: 'error',
            message: '发生未知错误', 
            offset: 40
        });
    }
};

export { get, post };

import { AxiosResponse } from 'axios';
import { get } from '../http';
import { GetResponse, UserCardReq } from './type';
const getLoginNav = (sessdata: string) => {
    return get({
        url: '/user/login/nav',
        headers: {
            sessdata
        }
    });
};
const getOwnInfo = (sessdata: string) => {
    return get({
        url: '/user/space/myinfo',
        headers: {
            sessdata
        }
    });
};
const getUserCard = (data: UserCardReq, sessdata: string): Promise<AxiosResponse<GetResponse>> => {
    return get({
        url: '/user/card',
        data,
        headers: {
            sessdata
        }
    });
};
export {
    getOwnInfo,
    getLoginNav,
    getUserCard
};
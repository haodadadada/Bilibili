import { AxiosResponse } from 'axios';
import { get } from '../http';
import { SearchAllReq, SearchTypeReq, GetResponse } from './type';
const getAllSearchList = async (data: SearchAllReq, sessdata: string) => {
    return await get({
        url: '/home/search/all',
        data,
        headers: {
            sessdata
        }
    });
};

const getTypeSearchList = async (data: SearchTypeReq, sessdata: string): Promise<AxiosResponse<GetResponse>> => {
    return await get({
        url: '/home/search/type',
        data,
        headers: {
            sessdata
        }
    });
};

export {
    getAllSearchList,
    getTypeSearchList
};
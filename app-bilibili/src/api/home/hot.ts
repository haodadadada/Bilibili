import { AxiosResponse } from 'axios';
import { get } from '../http';
import type { 
    HomePopularReq, 
    HomeSeriesReq, 
    HomeRankReq, 
    HomeHomePgcRankReq,
    GetResponse
} from './type';
const getHomePopular = async (data: HomePopularReq, sessdata: string): Promise<AxiosResponse<GetResponse>>  => {
    return await get({
        url: 'home/popular',
        data,
        headers: {
            sessdata
        }
    });
};
const getHomeSeries = async (): Promise<AxiosResponse<GetResponse>> => {
    return await get({
        url: 'home/series',
    });
};
const getHomeSeriesOne = async (data: HomeSeriesReq, sessdata: string): Promise<AxiosResponse<GetResponse>> => {
    return await get({
        url: 'home/series/one',
        data,
        headers: {
            sessdata: sessdata || ''
        }
    });
};
const getHomePrecious = async (): Promise<AxiosResponse<GetResponse>> => {
    return await get({
        url: 'home/precious'
    });
};
const getHomeRank = async (data: HomeRankReq, sessdata: string): Promise<AxiosResponse<GetResponse>> => {
    return await get({
        url: 'home/rank',
        data,
        headers: {
            sessdata
        }
    });
};
const getHomePgcRank = async (data: HomeHomePgcRankReq, sessdata: string): Promise<AxiosResponse<GetResponse>> => {
    return await get({
        url: 'home/pgc/rank',
        data,
        headers: {
            sessdata
        }
    });
};
export {
    getHomePopular,
    getHomeSeries,
    getHomeSeriesOne,
    getHomePrecious,
    getHomeRank,
    getHomePgcRank
};
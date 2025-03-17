import { AxiosResponse } from 'axios';
import { get } from '../http';
import type {
    LiveRecommandReq,
    LiveStreamUrlReq,
    LiveAreaRecommandReq,
    LiveDanmakuReq,
    LiveDanmakuPackageReq,
    LiveRoomInfoReq,
    LiveAnchorInfoReq,
    GetResponse
} from './type';
const getLiveRecommand = async (data: LiveRecommandReq, sessdata: string = ''): Promise<AxiosResponse<GetResponse>> => {
    return await get<GetResponse>({
        url: '/home/live/recommand',
        data,
        headers: {
            sessdata
        }
    });
};
const getLiveStreamUrl = async (data: LiveStreamUrlReq, sessdata: string = ''): Promise<AxiosResponse<GetResponse>> => {
    return await get<GetResponse>({
        url: '/home/live/playerurl',
        data,
        headers: {
            sessdata
        }
    });
};
const getLiveAreaList = async (): Promise<AxiosResponse<GetResponse>> => {
    return await get<GetResponse>({
        url: '/home/live/area'
    });
};
const getLiveCategoryRecommand = async (data: LiveAreaRecommandReq, sessdata: string): Promise<AxiosResponse<GetResponse>> => {
    return await get<GetResponse>({
        url: '/home/live/category/recommand',
        data,
        headers: {
            sessdata
        }
    });
};
/**
 * @description 必须传入cookie获取token否则ws连接会直接断开
 * @param data 
 * @param sessdata 
 * @returns 
 */
const getLiveDanmakuUrl = async (data: LiveDanmakuReq, sessdata: string = ''): Promise<AxiosResponse<GetResponse>> => {
    return await get<GetResponse>({
        url: '/home/live/danmaku',
        data,
        headers: {
            sessdata
        }
    });
};
const getLiveDanmakuPackage = async (data: LiveDanmakuPackageReq, sessdata: string = ''): Promise<AxiosResponse<GetResponse>> => {
    return await get<GetResponse>({
        url: '/home/live/danmaku/package',
        data,
        headers: {
            sessdata
        }
    });
};
const getLiveRoomInfo = async(data: LiveRoomInfoReq, sessdata: string = ''): Promise<AxiosResponse<GetResponse>> => {
    return await get<GetResponse>({
        url: '/home/live/room/info',
        data,
        headers: {
            sessdata
        }
    });
};
const getLiveAnchorInfo = async(data: LiveAnchorInfoReq, sessdata: string = ''): Promise<AxiosResponse<GetResponse>> => {
    return await get<GetResponse>({
        url: '/home/live/anchor/info',
        data,
        headers: {
            sessdata
        }
    });
};
export {
    getLiveRecommand,
    getLiveStreamUrl,
    getLiveAreaList,
    getLiveCategoryRecommand,
    getLiveDanmakuUrl,
    getLiveDanmakuPackage,
    getLiveRoomInfo,
    getLiveAnchorInfo
};
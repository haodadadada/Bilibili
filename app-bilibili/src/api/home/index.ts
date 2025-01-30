import { AxiosResponse } from 'axios';
import { get } from '../http';
import type { 
    HomePlayUrlReq, 
    HomeVideoStreamReq, 
    VideoInfoReqOptional, 
    VideoShotReq, 
    VideoRelatedReqOptional, 
    DmListReq, 
    GetResponse
} from './type';
const getHomePlayUrl = async (data: HomePlayUrlReq, sessdata: string): Promise<AxiosResponse<GetResponse>> => {
    return await get({
        url: '/home/playurl',
        data,
        headers: {
            sessdata,
        }
    });
};
const getHomeVideoStream = async (data: HomeVideoStreamReq, range: string, sessdata?: string): Promise<AxiosResponse<GetResponse>> => {
    return await get({
        url: '/home/video/stream',
        data,
        headers: {
            range,
            sessdata: sessdata || ''
        },
        responseType: 'arraybuffer'
    });
};

const getHomeVideoInfo = async (data: VideoInfoReqOptional, sessdata: string): Promise<AxiosResponse<GetResponse>> => {
    return await get({
        url: '/home/video/info',
        data,
        headers: {
            sessdata
        }
    });
};

const getHomeVideoShot = async (data: VideoShotReq): Promise<AxiosResponse<GetResponse>> => {
    return await get({
        url: '/home/video/shot',
        data
    });
};

const getHomeVideoRelated = async (data: VideoRelatedReqOptional): Promise<AxiosResponse<GetResponse>> => {
    return await get({
        url: '/home/video/recommand',
        data
    });
};
// axios不支持直接响应Uint8Array，需要手动转换
const getDmList = async (data: DmListReq, sessdata?: string) => {
    return await get({
        url: '/home/dm/list',
        data,
        headers: {
            sessdata: sessdata || ''
        },
        responseType: 'arraybuffer'
    });
};
export {
    getHomePlayUrl,
    getHomeVideoStream,
    getHomeVideoInfo,
    getHomeVideoShot,
    getHomeVideoRelated,
    getDmList
};
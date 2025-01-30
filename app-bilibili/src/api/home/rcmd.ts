import { get } from '../http';
import { AxiosResponse } from 'axios';
import type { HomeRecommandReq, GetResponse } from './type';
const getHomeRecommand = async (data: HomeRecommandReq, sessdata: string): Promise<AxiosResponse<GetResponse>> => {
    return await get<GetResponse>({
        url: '/home/recommand',
        data,
        headers: {
            sessdata
        }
    });
};
export {
    getHomeRecommand,
};
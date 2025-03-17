import { get } from '../http';
import { MainReplyReq, PermissionsReplyReq, SecondReplyReq } from './type';
const getMainReply = async (data: MainReplyReq, sessdata: string) => {
    return await get({
        url: 'reply/main',
        data,
        headers: {
            sessdata
        }
    });
};

const getPermissionsReply = async (data: PermissionsReplyReq, sessdata: string) => {
    return await get({
        url: 'reply/permissions',
        data,
        headers: {
            sessdata
        }
    });
};

const getSecondReply = async (data: SecondReplyReq, sessdata: string) => {
    return await get({
        url: 'reply/reply',
        data,
        headers: {
            sessdata
        }
    });
};
export {
    getMainReply,
    getPermissionsReply,
    getSecondReply
};
type UserCardReq = {
    mid: number,
    photo?: boolean
};

interface GetResponse {
    code: number,
    message?: string,
    data: {}
};
export {
    GetResponse,
    UserCardReq
};
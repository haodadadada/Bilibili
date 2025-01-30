export interface MainReplyReq {
    type: number,
    oid: number,
    wts: number,
    wrid: string
};

export interface PermissionsReplyReq {
    type: number,
    oid: number,
    wts: number,
    wrid: string
};

export interface SecondReplyReq {
    type: number,
    oid: number,
    root: number,
    wrid: number
};
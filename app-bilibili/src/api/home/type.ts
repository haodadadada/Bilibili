type RequiredOneOrBoth<T, K extends keyof T = keyof T> =
  | (Required<Pick<T, K>>)
  | (Partial<Pick<T, K>> & Required<Pick<T, Exclude<keyof T, K>>>);

export interface HomePopularReq {
    pn: number,
    ps: number
};

export interface HomeSeriesReq {
    number: string | number
};

export interface HomeRankReq {
    rid: number | string,
    type: string,
    web_location: number | string,
    wts: number | string,
    w_rid: string
};

export interface HomeHomePgcRankReq {
    season_type: number | string,
    web_location: number | string,
    day: number | string,
    wts: number | string,
    w_rid: string
};

export interface HomePlayUrlReq {
    bvid?: string | number,
    cid?: string | number,
    fnval: number
};

export interface HomeVideoStreamReq {
    videoStreamUrl: string
};
export interface VideoInfoReq {
    aid?: string,
    bvid?: string
};

export type VideoInfoReqOptional = RequiredOneOrBoth<VideoInfoReq, 'aid' | 'bvid'>;

export interface HomeRecommandReq {
    fresh_idx: number,
    ps: number,
    last_showlist: string[],
    wts: number
};

export interface VideoShotReq {
    aid?: string | number,
    bvid?: string | number,
    cid? : string | number,
    index? : number
};

export interface VideoRelatedReq {
    aid?: string,
    bvid?: string
};
export type VideoRelatedReqOptional = RequiredOneOrBoth<VideoRelatedReq, 'aid' | 'bvid'>;
export interface DmListReq {
    type: number,
    oid: number,
    pid?: number,
    segment_index: number,
    pull_mode?: number,
    ps?: number,
    pe?: number
};

export interface SearchAllReq {
    keyword: string,
    wts: number,
    w_rid: string
};

export interface SearchTypeReq {
    search_type: string,
    keyword: string,
    order?: string,
    order_sort?: number,
    user_type?: number,
    duration?: number,
    tids?: number,
    category_id?: number,
    page?: number
};

export interface LiveRecommandReq {
    page: number,
    page_size: number,
    platform: string,
    web_location: number,
    wts: number,
    w_rid: string
};

export interface LiveStreamUrlReq {
    room_id: number,
    protocol: string,
    format: string,
    codec: string,
    qn: number,
    platform: string,
    ptype: number,
    dolby: number,
    panorama: number,
    hdr_type: string,
    req_reason: number,
};

export interface LiveStreamReq {
    liveStreamUrl: string
};

export interface LiveAreaRecommandReq {
    platform: string,
    parent_area_id: number,
    area_id: number,
    sort_type?: string,
    page: number,
    web_location: number,
    wts: number,
    w_rid: string
};

export interface LiveDanmakuReq {
    id: number
};

export interface LiveDanmakuPackageReq {
    roomid: number, 
    key: string, 
    host: number, 
    wssPort: number,
    uid: number | string,
};

export interface LiveRoomInfoReq {
    room_id: number | string,
};

export interface LiveAnchorInfoReq {
    roomid: number | string,
};

export interface GetResponse {
    code: number,
    message?: string,
    data: any
};
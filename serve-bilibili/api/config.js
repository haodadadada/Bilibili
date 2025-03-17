// 登录
const URL_LOGIN_QRCODE = 'https://passport.bilibili.com/x/passport-login/web/qrcode/generate';
const URL_QRCODE_POLL = 'https://passport.bilibili.com/x/passport-login/web/qrcode/poll';
const URL_LOGIN_CAPTCHA = 'https://passport.bilibili.com/x/passport-login/captcha?source=main_web';
const URL_LOGIN_SMS_CAPTCHAKEY = 'https://passport.bilibili.com/x/passport-login/web/sms/send';
const URL_LOGIN_SMS = 'https://passport.bilibili.com/x/passport-login/web/login/sms';
const URL_COUNTRY_LIST = 'https://passport.bilibili.com/web/generic/country/list';
const URL_USER_MYINFO = 'https://api.bilibili.com/x/space/myinfo';
const URL_LOGIN_NAV = 'https://api.bilibili.com/x/web-interface/nav';

const URL_HOME_RECOMMAND = 'https://api.bilibili.com/x/web-interface/wbi/index/top/feed/rcmd';
// 视频流URL
const URL_HOME_VIDEO_PLAYER = 'https://api.bilibili.com/x/player/wbi/playurl';
// 综合热门
const URL_HOME_HOT_POPULAR = 'https://api.bilibili.com/x/web-interface/popular';
// 每周必看
const URL_HOME_HOT_SERIES = 'https://api.bilibili.com/x/web-interface/popular/series/list';
const URL_HOME_HOT_SERIES_ONE = 'https://api.bilibili.com/x/web-interface/popular/series/one';
// 入站必刷
const URL_HOME_HOT_PRECIOUS = 'https://api.bilibili.com/x/web-interface/popular/precious';
// 排行榜
const URL_HOME_HOT_RANKING = 'https://api.bilibili.com/x/web-interface/ranking/v2';
const URL_HOME_HOT_PGC_RANKGING = 'https://api.bilibili.com/pgc/season/rank/web/list';
const URL_HOME_HOT_PGC_ANIME_RANKGING = 'https://api.bilibili.com/pgc/web/rank/list';
const URL_HOME_BANGUMI_SORT = 'https://api.bilibili.com/pgc/season/index/result';
const URL_HOME_RECOMMAND_FEED = 'https://api.bilibili.com/pgc/page/web/v3/feed';

// 评论区
const URL_COMMENT_REPLY_MAIN = 'https://api.bilibili.com/x/v2/reply/wbi/main';
const URL_COMMENT_PERMISSIONS = 'https://api.bilibili.com/x/v2/reply/subject/interaction-status';  // oid=xx&type=xx
const URL_COMMENT_REPLY_REPLY = 'https://api.bilibili.com/x/v2/reply/reply';
// 视频详情
const URL_VIDEO_INFO = 'https://api.bilibili.com/x/web-interface/wbi/view';
// 视频快照
const URL_VIDEO_SHOT = 'https://api.bilibili.com/x/player/videoshot';
// 单视频推荐列表
const URL_VIDEO_RECOMMAND = 'https://api.bilibili.com/x/web-interface/archive/related';

// 实时弹幕
const URL_DM_LIST = 'https://api.bilibili.com/x/v2/dm/wbi/web/seg.so';

// 用户
const URL_USER_CARD = 'https://api.bilibili.com/x/web-interface/card';

// 综合搜索
const URL_SEARCH_ALL = 'https://api.bilibili.com/x/web-interface/wbi/search/all/v2';
// 分类搜索
const URL_SEARCH_TYPE = 'https://api.bilibili.com/x/web-interface/wbi/search/type';

// 推荐直播
const URL_LIVE_RECOMMAND = 'https://api.live.bilibili.com/xlive/web-interface/v1/second/getUserRecommend';
// 分类推荐列表
const URL_LIVE_CATEGORY_RECOMMAND = 'https://api.live.bilibili.com/xlive/web-interface/v1/second/getList';
// 直播分区列表
const URL_LIVE_AREA = 'https://api.live.bilibili.com/room/v1/Area/getList';
// 直播流URL
const URL_LIVE_PLAYER = 'https://api.live.bilibili.com/xlive/web-room/v2/index/getRoomPlayInfo';
// 直播间信息流URL
const URL_LIVE_DANMUKU = 'https://api.live.bilibili.com/xlive/web-room/v1/index/getDanmuInfo';
// 直播间信息
const URL_ROOM_INFO = 'https://api.live.bilibili.com/room/v1/Room/get_info';
// 直播间主播信息
const URL_ANCHOR_INFO = 'https://api.live.bilibili.com/live_user/v1/UserInfo/get_anchor_in_room';
module.exports = {
    URL_LOGIN_QRCODE,
    URL_QRCODE_POLL,
    URL_LOGIN_CAPTCHA,
    URL_LOGIN_SMS_CAPTCHAKEY,
    URL_LOGIN_SMS,
    URL_COUNTRY_LIST,
    URL_USER_MYINFO,
    URL_LOGIN_NAV,
    
    URL_HOME_RECOMMAND,
    URL_HOME_VIDEO_PLAYER,
    URL_HOME_HOT_POPULAR,
    URL_HOME_HOT_SERIES,
    URL_HOME_HOT_SERIES_ONE,
    URL_HOME_HOT_PRECIOUS,
    URL_HOME_HOT_RANKING,
    URL_HOME_HOT_PGC_RANKGING,
    URL_HOME_HOT_PGC_ANIME_RANKGING,
    URL_HOME_BANGUMI_SORT,
    URL_HOME_RECOMMAND_FEED,

    URL_COMMENT_REPLY_MAIN,
    URL_COMMENT_PERMISSIONS,
    URL_COMMENT_REPLY_REPLY,
    
    URL_VIDEO_INFO,
    URL_VIDEO_SHOT,
    URL_VIDEO_RECOMMAND,
    URL_DM_LIST,

    URL_USER_CARD,
    
    URL_SEARCH_ALL,
    URL_SEARCH_TYPE,

    URL_LIVE_RECOMMAND,
    URL_LIVE_CATEGORY_RECOMMAND,
    URL_LIVE_AREA,
    URL_LIVE_PLAYER,
    URL_LIVE_DANMUKU,
    URL_ROOM_INFO,
    URL_ANCHOR_INFO
};
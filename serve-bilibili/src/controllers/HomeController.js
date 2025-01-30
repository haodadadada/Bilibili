const Request = require('../../api/request');
const { 
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
    URL_VIDEO_INFO,
    URL_VIDEO_SHOT,
    URL_DM_LIST,
    URL_VIDEO_RECOMMAND,
    URL_SEARCH_ALL,
    URL_SSEARCH_TYPE
} = require('../../api/config');
class HomeController {
    static async fetchHomeRecommand(req, res) {
        try {
            const { sessdata } = req.headers;
            const response = await Request.get({
                url: URL_HOME_RECOMMAND,
                headers: {
                    'Cookie': sessdata ? `SESSDATA=${sessdata}` : '',
                    'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/124.0.0.0 Safari/537.36',
                    'Referer': 'https://www.bilibili.com/',
                    'Origin': 'https://www.bilibili.com'
                },
                data: req.query
            });
            const result = response.data;
            if(result.code === 0) {
                res.send({
                    ActionType: 'OK',
                    data: result.data,
                    code: result.code
                });
            }
            else {
                res.send({
                    message: result.message,
                    code: result.code
                });
            };
        } catch(error) {
            res.status(500).send({
                message: error.message || '服务器错误'
            });
        };
    };

    static async fetchHomeVideoPlayurl(req, res) {
        try {
            const { sessdata } = req.headers;
            const response = await Request.get({
                url: URL_HOME_VIDEO_PLAYER,
                headers: {
                    'Cookie': sessdata ? `SESSDATA=${sessdata}` : '',
                    'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/124.0.0.0 Safari/537.36',
                    'Referer': 'https://www.bilibili.com/',
                    'Origin': 'https://www.bilibili.com'
                },
                data: req.query
            });
            const result = response.data;
            if(result.code === 0) {
                res.send({
                    ActionType: 'OK',
                    data: result.data,
                    code: result.code
                });
            }
            else {
                res.send({
                    message: result.message,
                    code: result.code
                });
            };
        } catch(error) {
            res.status(500).send({
                message: error.message || '服务器错误'
            });
        };
    };

    static async fetchHomeVideoStream(req, res) {
        try {
            const { videoStreamUrl } = req.query;
            const { range } = req.headers;
            const { sessdata } = req.headers;
            const response = await Request.get({
                url: decodeURIComponent(videoStreamUrl),
                headers: {
                    'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/124.0.0.0 Safari/537.36',
                    'Referer': 'https://www.bilibili.com/',
                    'Origin': 'https://www.bilibili.com',
                    'Range': range ? 'bytes=' + range : '',
                    'Cookie': sessdata ? `SESSDATA=${sessdata}` : ''
                },
                responseType: 'stream'
            });
            res.setHeader('Content-Type', response.headers['content-type']);
            res.setHeader('Content-Length', response.headers['content-length']);
            response.headers['content-range'] ? res.setHeader('Content-Range', response.headers['content-range']) : '';
            response.data.pipe(res);
        } catch(error) {
            res.status(500).send({
                message: error.message || '服务器错误'
            });
        };
    };

    static async fetchHomePopular(req, res) {
        try {
            const { sessdata } = req.headers;
            const response = await Request.get({
                url: URL_HOME_HOT_POPULAR,
                headers: {
                    'Cookie': sessdata ? `SESSDATA=${sessdata}` : '',
                    'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/124.0.0.0 Safari/537.36',
                    'Referer': 'https://www.bilibili.com/',
                    'Origin': 'https://www.bilibili.com'
                },
                data: req.query
            });
            const result = response.data;
            if(result.code === 0) {
                res.send({
                    ActionType: 'OK',
                    data: result.data,
                    code: result.code
                });
            }
            else {
                res.send({
                    message: result.message,
                    code: result.code
                });
            };
        } catch(error) {
            res.status(500).send({
                message: error.message || '服务器错误'
            });
        };
    };

    static async fetchHomeSeriesList(req, res) {
        try {
            const response = await Request.get({
                url: URL_HOME_HOT_SERIES,
                headers: {
                    'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/124.0.0.0 Safari/537.36',
                    'Referer': 'https://www.bilibili.com/',
                    'Origin': 'https://www.bilibili.com'
                }
            });
            const result = response.data;
            if(result.code === 0) {
                res.send({
                    ActionType: 'OK',
                    data: result.data,
                    code: result.code
                });
            }
            else {
                res.send({
                    message: result.message,
                    code: result.code
                });
            };
        } catch(error) {
            res.status(500).send({
                message: error.message || '服务器错误'
            });
        };
    };

    static async fetchHomeSeriesOne(req, res) {
        try {
            const { sessdata } = req.headers;
            const response = await Request.get({
                url: URL_HOME_HOT_SERIES_ONE,
                headers: {
                    'Cookie': sessdata ? `SESSDATA=${sessdata}` : '',
                    'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/124.0.0.0 Safari/537.36',
                    'Referer': 'https://www.bilibili.com/',
                    'Origin': 'https://www.bilibili.com'
                },
                data: req.query
            });
            const result = response.data;
            if(result.code === 0) {
                res.send({
                    ActionType: 'OK',
                    data: result.data,
                    code: result.code
                });
            }
            else {
                res.send({
                    message: result.message,
                    code: result.code
                });
            };
        } catch(error) {
            res.status(500).send({
                message: error.message || '服务器错误'
            });
        };
    };

    static async fetchHomePreciousList(req, res) {
        try {
            const response = await Request.get({
                url: URL_HOME_HOT_PRECIOUS,
                headers: {
                    'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/124.0.0.0 Safari/537.36',
                    'Referer': 'https://www.bilibili.com/',
                    'Origin': 'https://www.bilibili.com'
                }
            });
            const result = response.data;
            if(result.code === 0) {
                res.send({
                    ActionType: 'OK',
                    data: result.data,
                    code: result.code
                });
            }
            else {
                res.send({
                    message: result.message,
                    code: result.code
                });
            };
        } catch(error) {
            res.status(500).send({
                message: error.message || '服务器错误'
            });
        };
    };

    static async fetchHomeRankList(req, res) {
        try {
            const { sessdata } = req.headers;
            const response = await Request.get({
                url: URL_HOME_HOT_RANKING,
                headers: {
                    'Cookie': sessdata ? `SESSDATA=${sessdata}` : '',
                    'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/124.0.0.0 Safari/537.36',
                    'Referer': 'https://www.bilibili.com/',
                    'Origin': 'https://www.bilibili.com'
                },
                data: req.query
            });
            const result = response.data;
            if(result.code === 0) {
                res.send({
                    ActionType: 'OK',
                    data: result.data,
                    code: result.code
                });
            }
            else {
                res.send({
                    message: result.message,
                    code: result.code
                });
            };
        } catch(error) {
            res.status(500).send({
                message: error.message || '服务器错误'
            });
        };
    };
    
    static async fetchHomePgcRankList(req, res) {
        try {
            const { season_type } = req.query;
            const { sessdata } = req.headers;
            const response = await Request.get({
                url: season_type === 1 ?  URL_HOME_HOT_PGC_ANIME_RANKGING : URL_HOME_HOT_PGC_RANKGING,
                headers: {
                    'Cookie': sessdata ? `SESSDATA=${sessdata}` : '',
                    'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/124.0.0.0 Safari/537.36',
                    'Referer': 'https://www.bilibili.com/',
                    'Origin': 'https://www.bilibili.com'
                },
                data: req.query
            });
            const result = response.data;
            if(result.code === 0) {
                res.send({
                    ActionType: 'OK',
                    data: season_type === 1 ? result.result : result.data,
                    code: result.code
                });
            }
            else {
                res.send({
                    message: result.message,
                    code: result.code
                });
            };
        } catch(error) {
            res.status(500).send({
                message: error.message || '服务器错误'
            });
        };
    };
    static async fetchHomeBangumi(req, res) {
        try {
            const response = await Request.get({
                url: URL_HOME_BANGUMI_SORT,
                headers: {
                    'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/124.0.0.0 Safari/537.36',
                    'Referer': 'https://www.bilibili.com/',
                    'Origin': 'https://www.bilibili.com'
                },
                data: req.query
            });
            const result = response.data;
            if(result.code === 0) {
                res.send({
                    ActionType: 'OK',
                    data: result.data,
                    code: result.code
                });
            }
            else {
                res.send({
                    message: result.message,
                    code: result.code
                });
            };
        } catch(error) {
            res.status(500).send({
                message: error.message || '服务器错误'
            });
        };
    };

    static async fetchHomeVideoInfo(req, res) {
        try {
            const { sessdata } = req.headers;

            const response = await Request.get({
                url: URL_VIDEO_INFO,
                headers: {
                    'Cookie': sessdata ? `SESSDATA=${sessdata}` : '',
                    'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/124.0.0.0 Safari/537.36',
                    'Referer': 'https://www.bilibili.com/',
                    'Origin': 'https://www.bilibili.com'
                },
                data: req.query
            });
            const result = response.data;
            if(result.code === 0) {
                res.send({
                    ActionType: 'OK',
                    data: result.data,
                    code: result.code
                });
            }
            else {
                res.send({
                    message: result.message,
                    code: result.code
                });
            };
        } catch(error) {
            res.status(500).send({
                message: error.message || '服务器错误'
            });
        };
    };

    static async fetchHomeVideoShot(req, res) {
        try {
            const response = await Request.get({
                url: URL_VIDEO_SHOT,
                headers: {
                    'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/124.0.0.0 Safari/537.36',
                    'Referer': 'https://www.bilibili.com/',
                    'Origin': 'https://www.bilibili.com'
                },
                data: req.query
            });
            const result = response.data;
            if(result.code === 0) {
                res.send({
                    ActionType: 'OK',
                    data: result.data,
                    code: result.code
                });
            }
            else {
                res.send({
                    message: result.message,
                    code: result.code
                });
            };
        } catch(error) {
            res.status(500).send({
                message: error.message || '服务器错误'
            });
        };
    };
    static async fetchHomeVideoRecommand(req, res) {
        try {
            const response = await Request.get({
                url: URL_VIDEO_RECOMMAND,
                headers: {
                    'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/124.0.0.0 Safari/537.36',
                    'Referer': 'https://www.bilibili.com/',
                    'Origin': 'https://www.bilibili.com'
                },
                data: req.query,
            });
            const result = response.data;
            if(result.code === 0) {
                res.send({
                    ActionType: 'OK',
                    data: result.data,
                    code: result.code
                });
            }
            else {
                res.send({
                    message: result.message,
                    code: result.code
                });
            };
        } catch(error) {
            res.status(500).send({
                message: error.message || '服务器错误'
            });
        };
    };
    static async fetchDmList(req, res) {
        try {
            let sessdata;
            if('sessdata' in req.headers) {
                sessdata = req.headers.sessdata;
            };
            const response = await Request.get({
                url: URL_DM_LIST,
                headers: {
                    'Cookie': sessdata ? `SESSDATA=${sessdata}` : '',
                    'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/124.0.0.0 Safari/537.36',
                    'Referer': 'https://www.bilibili.com/',
                    'Origin': 'https://www.bilibili.com'
                },
                data: req.query,
                responseType: 'arraybuffer'
            });
            res.set('Content-Type', 'application/octet-stream');
            res.send(response.data); // 返回二进制内容
        } catch(error) {
            res.status(500).send({
                message: error.message || '服务器错误'
            });
        };
    };
    static async fetchAllSearchList(req, res) {
        try {
            const { sessdata } = req.headers;
            const response = await Request.get({
                url: URL_SEARCH_ALL,
                headers: {
                    'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/124.0.0.0 Safari/537.36',
                    'Referer': 'https://www.bilibili.com/',
                    'Origin': 'https://www.bilibili.com',
                    'Cookie': sessdata ? `SESSDATA=${sessdata}` : ''
                },
                data: req.query,
            });
            const result = response.data;
            if(result.code === 0) {
                res.send({
                    ActionType: 'OK',
                    data: result.data,
                    code: result.code
                });
            }
            else {
                res.send({
                    message: result.message,
                    code: result.code
                });
            };
        } catch(error) {
            res.status(500).send({
                message: error.message || '服务器错误'
            });
        };
    };
    static async fetchTypeSearchList(req, res) {
        try {
            const { sessdata } = req.headers;
            const response = await Request.get({
                url: URL_SSEARCH_TYPE,
                headers: {
                    'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/124.0.0.0 Safari/537.36',
                    'Referer': 'https://www.bilibili.com/',
                    'Origin': 'https://www.bilibili.com',
                    'Cookie': sessdata ? `SESSDATA=${sessdata}` : ''
                },
                data: req.query,
            });
            const result = response.data;
            if(result.code === 0) {
                res.send({
                    ActionType: 'OK',
                    data: result.data,
                    code: result.code
                });
            }
            else {
                res.send({
                    message: result.message,
                    code: result.code
                });
            };
        } catch(error) {
            res.status(500).send({
                message: error.message || '服务器错误'
            });
        };
    };
};
module.exports = HomeController;
const Request = require('../../api/request');
// const WebSocket = require('ws');
// const { brotliDecompressSync } = require('zlib');
// const { TextDecoder } = require('util');
// const fetch = require('node-fetch');
// const fetchCookie = require('fetch-cookie').default;

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
    URL_SEARCH_TYPE,
    URL_LIVE_RECOMMAND,
    URL_LIVE_CATEGORY_RECOMMAND,
    URL_LIVE_AREA,
    URL_LIVE_PLAYER,
    URL_LIVE_DANMUKU,
    URL_ROOM_INFO,
    URL_ANCHOR_INFO
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
                url: URL_SEARCH_TYPE,
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
    static async fetchLiveRecommand(req, res) {
        try {
            const { sessdata } = req.headers;
            const response = await Request.get({
                url: URL_LIVE_RECOMMAND,
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
    static async fetchLiveCategoryRecommand(req, res) {
        try {
            const { sessdata } = req.headers;
            const response = await Request.get({
                url: URL_LIVE_CATEGORY_RECOMMAND,
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
    
    static async fetchLivePlayerurl(req, res) {
        try {
            const { sessdata } = req.headers;
            const response = await Request.get({
                url: URL_LIVE_PLAYER,
                headers: {
                    'Cookie': sessdata ? `SESSDATA=${sessdata}` : '',
                    'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/124.0.0.0 Safari/537.36',
                    'Referer': 'https://www.bilibili.com/',
                    'Origin': 'https://www.bilibili.com',
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
    static async fetchLiveAreaList(req, res) {
        try {
            const response = await Request.get({
                url: URL_LIVE_AREA,
                headers: {
                    'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/124.0.0.0 Safari/537.36',
                    'Referer': 'https://www.bilibili.com/',
                    'Origin': 'https://www.bilibili.com',
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
    
    static async fetchLiveStream(req, res) {
        try {
            const { sessdata } = req.headers;
            const { liveStreamUrl } = req.query;
            const response = await Request.get({
                url: liveStreamUrl,
                headers: {
                    'Cookie': sessdata ? `SESSDATA=${sessdata}` : '',
                    'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/124.0.0.0 Safari/537.36',
                    'Referer': 'https://live.bilibili.com/',
                    'Origin': 'https://live.bilibili.com'
                },
                responseType: 'stream'
            });
            response.data.pipe(res);
        } catch(error) {
            console.log(error);
            res.status(500).send({
                message: error.message || '服务器错误'
            });
        };
    };

    static async fetchLiveDanmakuUrl(req, res) {
        try {
            const { sessdata } = req.headers;
            const { id } = req.query || '';
            const response = await Request.get({
                url: URL_LIVE_DANMUKU,
                headers: {
                    'Cookie': sessdata ? `SESSDATA=${sessdata}` : '',
                    'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/124.0.0.0 Safari/537.36',
                    'Referer': `https://live.bilibili.com/${id}`,
                    'Origin': 'https://live.bilibili.com',
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
    
    // static async fetchLiveDanmakuPackage(req, res) {
    //     try {
    //         const { host, wssPort, roomid, key, uid } = req.query;
    //         const { sessdata } = req.headers;
    //         const fetchWithCookies = fetchCookie(fetch);
    //         const response = await fetchWithCookies(`https://api.live.bilibili.com/xlive/web-room/v1/index/getDanmuInfo?id=${roomid}`, {
    //             headers: {
    //                 'Cookie': 'SESSDATA=b3d42ea3,1756704148,3b094*32CjDrjj7RfaWETP_bOZB5UlVe0QNV6n4KlS3adeJuXy6er2a2ayGaFlZZIr1YO2wV0WQSVkRqMHhyZVBhZE1tallwb01kc2hpQlRrOG9VZjlYOUQxSDBmWXVnLUdlZFl3SGliR1NzLUVRYkQ5WndqZ09CQnJQc2lCWHB2dUlwaWh1ZWdMOTdBcFRBIIEC'
    //             }
    //         });
    //         const data = await response.json();
    //         const token = data.data.token;
    //         // 封装为指定格式包
    //         function encodePacket(op, body) {
    //             const headerLength = 16;
    //             const protocol = 1;
    //             const type = op;
    //             const sequence = 2;
    //             const bodyBuffer = Buffer.from(JSON.stringify(body));
    //             const headerBuffer = Buffer.alloc(headerLength);
    //             headerBuffer.writeUInt32BE(headerLength + bodyBuffer.length, 0);
    //             headerBuffer.writeUInt16BE(headerLength, 4);
    //             headerBuffer.writeUInt16BE(protocol, 6);
    //             headerBuffer.writeUInt32BE(type, 8);
    //             headerBuffer.writeUInt32BE(sequence, 12);
            
    //             return Buffer.concat([headerBuffer, bodyBuffer]);
    //         };

    //         // 解析数据包头部
    //         async function parsePacketHeader(buffer) {
    //             const totalSize = buffer.readUInt32BE(0);
    //             const headerSize = buffer.readUInt16BE(4);
    //             const protocolVersion = buffer.readUInt16BE(6);
    //             const operationCode = buffer.readUInt32BE(8);
    //             const sequence = buffer.readUInt32BE(12);

    //             const bodyBuffer = buffer.slice(headerSize);

    //             if (protocolVersion === 3) {
    //                 await parseCompressedBody(bodyBuffer);
    //             };

    //             return { totalSize, headerSize, protocolVersion, operationCode, sequence };
    //         };

    //         // 解析 Brotli 压缩数据
    //         async function parseCompressedBody(buffer) {
    //             try {
    //                 // Brotli 解压缩
    //                 const decompressedData = brotliDecompressSync(buffer);

    //                 // 解析 JSON
    //                 const textDecoder = new TextDecoder('utf-8');
    //                 const decompressedString = textDecoder.decode(decompressedData);
    //                 const cleanJSONArrString = extractJSONFast(cleanJSONData(decompressedString));

    //                 processDanmakuData(cleanJSONArrString);
    //             } catch (error) {
    //                 console.log('解压缩数据错误:', error);
    //             }
    //         };

    //         // 处理弹幕数据
    //         function processDanmakuData(dataArr) {
    //             dataArr.forEach((data) => {
    //                 if (data.cmd === 'DANMU_MSG') {
    //                     const info = JSON.parse(data.info[0][15].extra);
    //                     console.log(info);
    //                 }
    //             });
    //         };

    //         // 去除无效字符
    //         function cleanJSONData(text) {
    //             return text.replace(/[^\x20-\x7E]/g, '');
    //         };

    //         // 提取 JSON
    //         function extractJSONFast(text) {
    //             const results = [];
    //             let start = -1;
    //             let depth = 0;
    //             for (let i = 0; i < text.length; i++) {
    //                 if (text[i] === '{') {
    //                     if (depth === 0) start = i;
    //                     depth++;
    //                 } else if (text[i] === '}') {
    //                     depth--;
    //                     if (depth === 0 && start !== -1) {
    //                         const jsonStr = text.slice(start, i + 1);
    //                         try {
    //                             results.push(JSON.parse(jsonStr));
    //                         } catch (error) {
    //                             console.error('JSON 解析失败:', jsonStr, error);
    //                         }
    //                         start = -1;
    //                     }
    //                 }
    //             }
    //             return results;
    //         };

    //         // 连接 WebSocket
    //         const connectDanmakuStream = async ({ roomid, host, wssPort, key, uid = 0 }) => {
    //             if (!roomid) {
    //                 console.error('房间号为空');
    //                 return;
    //             };
    //             const url = 'wss://' + host + ':' + wssPort + '/sub';
    //             const ws = new WebSocket(url, {
    //                 headers: {
    //                     // 'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/124.0.0.0 Safari/537.36',
    //                     'User-Agent': 'Mozilla/5.0 (X11; Linux x86_64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/131.0.0.0 Safari/537.36'
    //                     // 'Origin': 'https://live.bilibili.com',
    //                     // 'Upgrade': 'websocket',
    //                     // 'Connection': 'Upgrade',
    //                     // 'Sec-WebSocket-Extensions': 'permessage-deflate; client_max_window_bits',
    //                     // 'Sec-WebSocket-Version': '13',
    //                     // 'Host': host,
    //                 }
    //             });
    //             ws.on('open', () => {
    //                 const authData = {
    //                     roomid,
    //                     uid,
    //                     key: token,
    //                     platform: 'web',
    //                     type: 2,
    //                     protover: 3,
    //                     buvid: '20D52E77-016F-394B-74F6-8D00A476EBAB69954infoc',
    //                 };
    //                 const authPacket = encodePacket(7, authData);
    //                 if(ws.readyState === WebSocket.OPEN) {
    //                     ws.send(authPacket);
    //                     console.log('发送认证包:', authData);
    //                 };
    //             });

    //             ws.on('message', async (data) => {
    //                 await parsePacketHeader(data);
    //             });

    //             ws.on('error', (error) => {
    //                 console.error('WebSocket 错误:', error);
    //             });

    //             ws.on('close', (code, reason) => {
    //                 console.log('WebSocket 连接关闭', code, reason);
    //                 timer && clearInterval(timer);
    //             });

    //             // 发送心跳包
    //             let timer = null;
    //             timer = setInterval(() => {
    //                 const heartbeatPacket = encodePacket(2, {});
    //                 ws.send(heartbeatPacket);
    //                 console.log('发送心跳包');
    //             }, 30000);
    //         };
    //         connectDanmakuStream({ roomid, host, wssPort, uid, key}, sessdata);
    //         res.status(200).send('OK');
    //     } catch(error) {
    //         console.log('websocket error:', error);
    //         res.status(500).send({
    //             message: error.message || '服务器错误'
    //         });
    //     };
    // };
    static async fetchRoomInfo(req, res) {
        try {
            const { sessdata } = req.headers;
            const response = await Request.get({
                url: URL_ROOM_INFO,
                headers: {
                    'Cookie': sessdata ? `SESSDATA=${sessdata}` : '',
                    'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/124.0.0.0 Safari/537.36',
                    'Origin': 'https://live.bilibili.com',
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
    static async fetchAnchorInfo(req, res) {
        try {
            const { sessdata } = req.headers;
            const response = await Request.get({
                url: URL_ANCHOR_INFO,
                headers: {
                    'Cookie': sessdata ? `SESSDATA=${sessdata}` : '',
                    'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/124.0.0.0 Safari/537.36',
                    'Origin': 'https://live.bilibili.com',
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
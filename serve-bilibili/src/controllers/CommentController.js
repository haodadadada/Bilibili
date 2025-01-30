const Request = require('../../api/request');
const { 
    URL_COMMENT_REPLY_MAIN,
    URL_COMMENT_PERMISSIONS,
    URL_COMMENT_REPLY_REPLY
} = require('../../api/config');

class CommentController {
    static async fetchMainReply(req, res) {
        try {
            const { sessdata } = req.headers;
            const response = await Request.get({
                url: URL_COMMENT_REPLY_MAIN,
                headers: {
                    "Cookie": sessdata ? `SESSDATA=${sessdata}` : '',
                    "User-Agent": 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/124.0.0.0 Safari/537.36',
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
    static async fetchPermissionsReply(req, res) {
        try {
            const { sessdata } = req.headers;
            const response = await Request.get({
                url: URL_COMMENT_PERMISSIONS,
                headers: {
                    "Cookie": sessdata ? `SESSDATA=${sessdata}` : '',
                    "User-Agent": 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/124.0.0.0 Safari/537.36',
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
    static async fetchSecondReply(req, res) {
        try {
            const { sessdata } = req.headers;
            const response = await Request.get({
                url: URL_COMMENT_REPLY_REPLY,
                headers: {
                    "Cookie": sessdata ? `SESSDATA=${sessdata}` : '',
                    "User-Agent": 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/124.0.0.0 Safari/537.36',
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
};
module.exports = CommentController;
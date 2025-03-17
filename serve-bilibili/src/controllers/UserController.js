const MD5 = require('md5');
const Request = require('../../api/request');
const { 
    URL_LOGIN_QRCODE, 
    URL_QRCODE_POLL, 
    URL_LOGIN_CAPTCHA, 
    URL_LOGIN_SMS_CAPTCHAKEY ,
    URL_LOGIN_SMS,
    URL_COUNTRY_LIST,
    URL_LOGIN_NAV,
    URL_USER_MYINFO,
    URL_USER_CARD
} = require('../../api/config');
class UserController {
    static buvid() {
        var mac = [];
        for (let i = 0; i < 6; i++) {
            var min = Math.min(0, 0xff)
            var max = Math.max(0, 0xff)
            var num = parseInt((Math.random() * (min - max + 1) + max).toString()).toString(16)
            mac.push(num)
        }
        var md5 = MD5(mac.join(':'));
        var md5Arr = md5.split('');
        return `XY${md5Arr[2]}${md5Arr[12]}${md5Arr[22]}${md5}`
    }
    static async fetchQRCode(req, res) {
        try {
            let response = await Request.get({
                url: URL_LOGIN_QRCODE
            });
            // 成功响应
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
                message: error.message
            });
        };
    };
    static async fetchQRCodePoll(req, res) {
        try {
            const { qrcode_key } = req.query;
            let response = await Request.get({
                url: URL_QRCODE_POLL,
                data: {
                    qrcode_key
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
                message: error.message
            });
        };
    };
    static async fetchGeetest(req, res) {
        try {
            const response = await Request.get({
                url: 'https://static.geetest.com/static/js/gt.0.4.9.js'
            });
            const result = response.data;
            res.set('Content-Type', 'application/javascript');
            res.setHeader('Access-Control-Allow-Origin', '*');
            // 确保资源可以跨域加载
            res.setHeader('Cross-Origin-Resource-Policy', 'cross-origin');
            // 允许跨域嵌入
            res.setHeader('Cross-Origin-Embedder-Policy', 'unsafe-none'); 
            res.send(result);
        } catch (error) {
            res.status(500).send({
                message: error.message
            });
        };
    };
    static async fetchCaptcha(req, res) {
        try {
            const response = await Request.get({
                url: URL_LOGIN_CAPTCHA
            }); // 替换为你的服务端API URL
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
        } catch (error) {
            res.status(500).send({
                message: error.message
            });
        };
    };
    static async fetchSmsKey(req, res) {
        try {
            const params = req.body;

            const response = await Request.post({
                url: URL_LOGIN_SMS_CAPTCHAKEY,
                header: 'application/x-www-form-urlencoded',
                headers: {
                    "User-Agent": "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36 Edg/120.0.0.0",
                    'Referer': 'https://www.bilibili.com/',
                    'Origin': 'https://www.bilibili.com',
                    'Buvid': UserController.buvid()
                },
                data: params
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
                message: error.message
            });
        };
    };
    static async fetchSmsLogin(req, res) {
        try {
            const params = req.body;
            const response = await Request.post({
                url: URL_LOGIN_SMS,
                data: params,
                header: 'application/x-www-form-urlencoded',
                headers: {
                    "User-Agent": "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36 Edg/120.0.0.0",
                    'Referer': 'https://www.bilibili.com/',
                    'Origin': 'https://www.bilibili.com',
                    'Buvid': UserController.buvid()
                },
            });
            const setCookieHeaders = response.headers.get('set-cookie');
            let sessdata;
            if (setCookieHeaders) {
                for(const cookie of setCookieHeaders) {
                    const match = cookie.match(/^SESSDATA=([^;]*)/);
                    if(match) {
                        sessdata = match[1];
                        break;
                    }
                }
            };
            const result = response.data;
            if(result.code === 0) {
                res.send({
                    ActionType: 'OK',
                    data: result.data,
                    sessdata,
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
                message: error.message
            });
        };
    };
    static async fetchCountryList(req, res) {
        try {
            const response = await Request.get({
                url: URL_COUNTRY_LIST
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
                message: error.message.message
            });
        };
    };

    static async fetchLoginNav(req, res) {
        try {
            const { sessdata } = req.headers;
            const response = await Request.get({
                url: URL_LOGIN_NAV,
                headers: {
                    "Cookie": `SESSDATA=${sessdata}`,
                    "User-Agent": 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/124.0.0.0 Safari/537.36',
                    'Referer': 'https://www.bilibili.com/',
                    'Origin': 'https://www.bilibili.com'
                },
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
                    data: result.data,
                    code: result.code
                });
            };
        } catch(error) {
            res.status(500).send({
                message: error.message.message
            });
        };
    };

    static async fetchOwnInfo(req, res) {
        try {
            const { sessdata } = req.headers;
            const response = await Request.get({
                url: URL_USER_MYINFO,
                headers: {
                    "Cookie": `SESSDATA=${sessdata}`,
                    "User-Agent": 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/124.0.0.0 Safari/537.36',
                    'Referer': 'https://www.bilibili.com/',
                    'Origin': 'https://www.bilibili.com'
                },
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
                message: error.message.message
            });
        };
    };
    static async fetchUserCard(req, res) {
        try {
            const { sessdata } = req.headers;
            const response = await Request.get({
                url: URL_USER_CARD,
                headers: {
                    "Cookie": `SESSDATA=${sessdata}`,
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
                message: error.message.message
            });
        };
    };
};

module.exports =  UserController;
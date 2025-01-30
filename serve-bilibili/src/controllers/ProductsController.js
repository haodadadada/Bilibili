const axios = require('axios');
const ProductsController = {
    getList: async (req, res) => {
        try {
            const result = await ProductsService.getList();
            res.send({
                ActionType: 'OK',
                data: result
            })
        } catch(err) {
            res.status(500).send({message: err});
        }

    },
    getWeeklyList: async(req, res) => {
        axios.get(`https://storage.moegirl.org.cn/homeland/data/topics-weekly-bangumi.json?t=${new Date().getTime()}`).then(result => {
            let {data} = result;
            res.send({
                ActionType: 'OK',
                data
            })
        }).catch(err => {
            res.status(500).send({
                errMessage: err
            })
        })
    },
    getHistory: async(req, res) => {
        let {SESSDATA, view_at} = req.query;
        let result = await axios.get('https://api.bilibili.com/x/web-interface/history/cursor', {
            headers: {
                "Cookie": `SESSDATA=${SESSDATA}`,
                "User-Agent": 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/124.0.0.0 Safari/537.36',
            },
            params: {
                view_at,
            }
        })
        if(result.data.code === 0) {
            res.send({
                ActionType: 'OK',
                data: result.data.data,
                code: result.data.code,
            })
        }
        else {
            res.send({
                code: result.data.code,
                message: result.data.message
            })
        }
    },
    getUserInfo: async(req, res) => {
        let {SESSDATA} = req.query;
        let result = await axios.get('https://api.bilibili.com/x/web-interface/nav', {
            headers: {
                "Cookie": `SESSDATA=${SESSDATA}`,
                "User-Agent": 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/124.0.0.0 Safari/537.36'
            }
        })
        if(result.data.code === 0) {
            res.send({
                ActionType: 'OK',
                data: result.data.data,
                code: result.data.code,
            })
        }
        else {
            res.send({
                code: result.data.code,
                message: result.data.message
            })
        }
    }
}

module.exports = ProductsController; 
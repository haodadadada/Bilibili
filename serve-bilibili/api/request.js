const axios = require('axios');
axios.interceptors.request.use(config => {
    return config;
});
axios.interceptors.response.use(config => {
    return config;
});

class Request {
    static async get(option) {
        try {
            let result = await axios({
                method: 'get',
                url: option.url,
                params: option.data,
                headers: {
                    'Content-Type': option.header || 'application/json; charset=utf-8',
                    ...option.headers
                },
                responseType: option.responseType || 'json'
            });
            return result;
        } catch(err) {
            throw(new Error(err));
        };
    };
    static async post(option) {
        try {
            let result = await axios({
                method: 'post',
                url: option.url,
                headers: {
                    'Content-Type': option.header || 'application/json; charset=utf-8',
                    ...option.headers
                },
                data: option.data,
                responseType: option.responseType || 'json'
            });
            return result;
        } catch(err) {
            throw(new Error(err));
        };
    };
};
module.exports = Request;
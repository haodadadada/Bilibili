const JWT = require('../JWT/JWT-web');
module.exports = (req, res, next) => {
    if(req.url === '/webapi/user/login' || req.url === '/webapi/user/resigist') {
        next();
        return;
    }
    // 校验token有没有过期
    else {
        const token = req.headers['authorization'];
        if(token) {
            let payload = JWT.verify(token);
            if(payload) {
                let newToken = JWT.generate({id: payload.id, username: payload.username, avatar: payload.avatar || ''}, '10h');
                res.header('authorization', newToken);
                req.userId = payload.id;
                req.userName = payload.username;
                req.avatar = payload.avatar;
                next();
            }
            else {
                res.status(401).send({errCode: -1, errMessage: 'token过期'});
            }
        }
        else {
            res.status(401).send({errCode: -1, errMessage: '未登录'});
        }
    }
  }
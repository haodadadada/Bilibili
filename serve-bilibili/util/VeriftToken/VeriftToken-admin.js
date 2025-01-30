const JWT = require('../JWT/JWT-admin');
module.exports = (req, res, next) => {
    if(req.url === '/adminapi/user/login') {
      next();
      return;
    }
    // 校验token有没有过期
    else {
      const token = req.headers['authorization'];
      if(token) {
        let payload = JWT.verify(token);
        if(payload) {
          let newToken = JWT.generate({_id: payload._id, username: payload.username}, '10h');
          res.header('authorization', newToken);
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
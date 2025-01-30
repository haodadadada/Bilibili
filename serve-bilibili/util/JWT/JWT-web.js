const jsonwebtoken = require('jsonwebtoken');
const secret = 'ACG';
const JWT = {
    // 生成方法
    generate(value, exprires) {
        return jsonwebtoken.sign(value, secret, {expiresIn: exprires})
    },
    // 验证方法
    verify(token) {
        try {
            return jsonwebtoken.verify(token, secret);
        } catch(e) {
            return false
        }
    }
}

module.exports = JWT;
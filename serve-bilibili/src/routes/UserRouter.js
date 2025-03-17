var express = require('express');
const UserController = require('../controllers/UserController');
/* GET users listing. */
class UserRouter {
    constructor() {
        this.router = express.Router();
        this.initRoute();
    }
    initRoute() {
        this.router.get('/webapi/user/qrcode_generate', UserController.fetchQRCode);
        this.router.get('/webapi/user/qrcode_poll', UserController.fetchQRCodePoll);

        this.router.get('/webapi/user/login/geetest', UserController.fetchGeetest);
        this.router.get('/webapi/user/login/captcha', UserController.fetchCaptcha);
        this.router.post('/webapi/user/login/sms/send', UserController.fetchSmsKey);
        this.router.post('/webapi/user/login/sms', UserController.fetchSmsLogin);
        this.router.get('/webapi/user/country/list', UserController.fetchCountryList);
    
        this.router.get('/webapi/user/login/nav', UserController.fetchLoginNav);
        this.router.get('/webapi/user/space/myinfo', UserController.fetchOwnInfo);
        this.router.get('/webapi/user/card', UserController.fetchUserCard);
    }
    getRouter() {
        return this.router;
    }
};
module.exports = new UserRouter();

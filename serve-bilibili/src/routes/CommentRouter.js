var express = require('express');
const CommentController = require('../controllers/CommentController');
/* GET users listing. */
class CommentRouter {
    constructor() {
        this.router = express.Router();
        this.initRoute();
    };
    initRoute() {
        this.router.get('/webapi/reply/main', CommentController.fetchMainReply);
        this.router.get('/webapi/reply/permissions', CommentController.fetchPermissionsReply);
        this.router.get('/webapi/reply/reply', CommentController.fetchSecondReply);
    };
    getRouter() {
        return this.router;
    };
};
module.exports = new CommentRouter();
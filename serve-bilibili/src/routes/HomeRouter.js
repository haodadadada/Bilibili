var express = require('express');
const HomeController = require('../controllers/HomeController');
class HomeRouter {
    constructor() {
        this.router = express.Router();
        this.initRoute();
    };
    initRoute() {
        this.router.get('/webapi/home/playurl', HomeController.fetchHomeVideoPlayurl);
        this.router.get('/webapi/home/video/stream', HomeController.fetchHomeVideoStream);
        
        this.router.get('/webapi/home/recommand', HomeController.fetchHomeRecommand);
        this.router.get('/webapi/home/popular', HomeController.fetchHomePopular);
        this.router.get('/webapi/home/series', HomeController.fetchHomeSeriesList);
        this.router.get('/webapi/home/series/one', HomeController.fetchHomeSeriesOne);
        this.router.get('/webapi/home/precious', HomeController.fetchHomePreciousList);
        this.router.get('/webapi/home/rank', HomeController.fetchHomeRankList);
        this.router.get('/webapi/home/pgc/rank', HomeController.fetchHomePgcRankList);
        this.router.get('/webapi/home/bangumi', HomeController.fetchHomeBangumi);

        this.router.get('/webapi/home/video/info', HomeController.fetchHomeVideoInfo);
        this.router.get('/webapi/home/video/shot', HomeController.fetchHomeVideoShot);
        this.router.get('/webapi/home/video/recommand', HomeController.fetchHomeVideoRecommand);
        this.router.get('/webapi/home/dm/list', HomeController.fetchDmList);

        this.router.get('/webapi/home/search/all', HomeController.fetchAllSearchList);
        this.router.get('/webapi/home/search/type', HomeController.fetchTypeSearchList);
    };
    getRouter() {
        return this.router;
    };
};
module.exports = new HomeRouter();
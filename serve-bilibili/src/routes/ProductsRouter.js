var express = require('express');
var ProductsRouter = express.Router();
const ProductsController = require('../controllers/ProductsController');
// 涉及文件上传 普通post不能拿到文件 需要加上multer中间件
ProductsRouter.get('/webapi/products/list', ProductsController.getList);
ProductsRouter.get('/webapi/products/weekly', ProductsController.getWeeklyList);
ProductsRouter.get('/webapi/products/bili_history', ProductsController.getHistory);
ProductsRouter.get('/webapi/products/bili_info', ProductsController.getUserInfo);
module.exports = ProductsRouter;
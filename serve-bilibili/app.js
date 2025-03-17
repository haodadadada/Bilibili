var createError = require('http-errors');
var express = require('express');
var path = require('path');
var cookieParser = require('cookie-parser');
var logger = require('morgan');

var indexRouter = require('./src/routes/index');
const userRouter = require('./src/routes/UserRouter');
const homeRouter = require('./src/routes/HomeRouter');
const commentRouter = require('./src/routes/CommentRouter');
var app = express();
// 设置视图文件夹
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'ejs');

const cors = require('cors')
app.use(cors())

app.use(logger('dev'));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));

const loggerMiddleware = require('./src/middleware/logger');
app.use(loggerMiddleware);

app.use(userRouter.getRouter());
app.use(homeRouter.getRouter());
app.use(commentRouter.getRouter());
// 注册路由
app.use('/', indexRouter);
// catch 404 and forward to error handler
app.use(function(req, res, next) {
  next(createError(404));
});

// error handler
app.use(function(err, req, res, next) {
  // set locals, only providing error in development
  res.locals.message = err.message;
  res.locals.error = req.app.get('env') === 'development' ? err : {};

  // render the error page
  res.status(err.status || 500);
  res.render('error');
});

module.exports = app;

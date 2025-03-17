const log4js = require('log4js');

log4js.configure({
    appenders: {
        out: {
            type: 'stdout', //输出到控制台
            layout: {
                type: 'colored'   //使用带颜色的布局
            }
        },
        file: {
            type: 'file',
            filename: './logs/server.log'
        }
    },
    categories: {
        default: {
            appenders: ['out', 'file'],  //使用out和file输出器
            level: 'debug' //设置日志级别为 debug
        }
    }
});

const logger = log4js.getLogger('default');

const loggerMiddleware = (req, res, next) => {
    logger.debug(`${req.method} ${req.url}`); //记录请求方法和URL
    next();
};

module.exports = loggerMiddleware;
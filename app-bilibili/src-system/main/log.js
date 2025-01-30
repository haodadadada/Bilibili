import { app } from 'electron';
import path from 'path';
import log from 'electron-log';
import fs from 'fs';

// 设置记入文件的日志级别
log.transports.file.level = 'warn';
// 设置日志文件的最大容量
log.transports.file.maxSize = 10 * 1024 * 1024;
// 设置日志文件的格式
log.transports.file.format = '[{y}-{m}-{d} {h}:{i}:{s}.{ms}] [{level}]{scope} {text}';
// 配置终端日志输出，记录所有级别的日志
log.transports.console.level = 'silly'; 

// 重新定义日志输入的文件位置以及文件名
const currentDate = new Date().getFullYear() + '-' + (new Date().getMonth() + 1) + '-' + new Date().getDate();
const fileName = `${currentDate}@${app.getVersion()}.log`;
const logDir = path.join(app.getPath('userData'), 'logs');
const logFilePath = path.join(logDir, fileName);
function ensureDirectoryExistence(dirPath) {
  if (fs.existsSync(dirPath)) {
    if (!fs.statSync(dirPath).isDirectory()) {
      throw new Error(`Path ${dirPath} exists and is not a directory.`);
    };
  }
  else {
    fs.mkdirSync(dirPath, { recursive: true });
  };
};

let logger = {
  error(param) {
    log.error(param);
  },
  warn(param) {
    log.warn(param);
  },
  info(param) {
    log.info(param);
  },
  verbose(param) {
    log.verbose(param);
  },
  debug(param) {
    log.debug(param);
  },
  silly(param) {
    log.silly(param);
  }
};

function main() {
  try {
    ensureDirectoryExistence(logDir);
  } catch (error) {
    logger.error(error);
  };
  
  // 设置日志文件路径
  log.transports.file.resolvePathFn = () => logFilePath;
};
main();


export default {
  logger
};
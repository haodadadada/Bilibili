import { app } from 'electron';
import path from 'path';
import fs from 'fs';

// 配置文件路径
const configPath = path.join(app.getPath('userData'), 'setting.json');

// 默认配置
const defaultConfig = {
  common: {
    // 启动颜色
    theme: {
      index: 0,
      options: [
        { label: '自动记忆' },
        { label: '跟随系统' },
        { label: '浅色模式' },
        { label: '深色模式' }
      ]
    },
    // 字体
    fontFamily: {
      index: 1,
      options: [
        { label: '系统默认', value: 'system-ui, sans-serif' },
        { label: 'HarmonyOS Sans', value: 'HarmonyOS Sans, sans-serif' },
      ]
    },
    // 开机自启动
    isAutomatic: false,
    // 关闭主界面
    closeMain: {
      index: 1,
      options: [
        { label: '最小化到托盘' },
        { label: '退出程序' }
      ]
    },
    isShowCloseMainPrompt: true
  },
  download: {}
};
 
// 读取配置文件
function readConfig() {
  if (fs.existsSync(configPath)) {
    const config = fs.readFileSync(configPath);
    return JSON.parse(config);
  } else {
    writeConfig(defaultConfig);
    return defaultConfig;
  };
};

// 写入配置文件
function writeConfig(config) {
  fs.writeFileSync(configPath, JSON.stringify(config, null, 2), 'utf-8');
};

// 使用配置
let config = readConfig();

function getConfig() {
  // 返回一个浅拷贝 防止直接修改配置
  return { ...config };
};

// 修改配置
function setConfig(newConfig) {
  config = Object.assign(config, newConfig);
  writeConfig(config);
};
 
function resetConfig() {
  config = Object.assign(config, defaultConfig);
  writeConfig(config);
};

readConfig();

export {
  getConfig,
  setConfig,
  resetConfig
};
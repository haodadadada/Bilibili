// 拆分main.js 由于复杂类型数据传递是浅拷贝的形式所以通过传递函数参数的方式拆分
// 拆分为app、ipc、win、webContents、tray模块
import { app, BrowserWindow, globalShortcut, dialog } from 'electron';
import { fileURLToPath } from 'url';
import * as R from 'ramda';
import AppEvents from './main/appEvent.js';
import dotenv from 'dotenv';
import ipcHandler from './main/ipcHandler.js';
import log from './main/log.js';
import path from 'path';
import TrayEvents from './main/TrayEvent.js';

const { logger } = log;
const { mainWindowIpc, loginWindowIpc, playerWindowIpc, loadingWindowIpc, commomIpc }  = ipcHandler;
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

process.env['ELECTRON_DISABLE_SECURITY_WARNINGS'] = 'true';
app.commandLine.appendSwitch('no-sandbox');
app.disableHardwareAcceleration();

const getIconPath = () => process.env.VITE_DEV_SERVER_URL ?
  path.join(__dirname, '../public/icon/bilibili-logo.ico') :
  path.join(path.dirname(app.getPath('exe')), '/resources/public/icon/bilibili-logo.ico');

let iconPath = getIconPath();
let win = null;
let tray;

const mainWindowConfigure = () => {
  // win.webContents.openDevTools();
  globalShortcut.register('CommandOrControl+R', () => win.reload());
  globalShortcut.register('F5', () => win.reload());
};

const handleMainWindowEvents = () => {
  win.once('ready-to-show', () => {
    isMainWinLoaded = true;
    closeLoadingWindow();
    win.show();
  });
  win.on('close', () => {
    win = null;
    updateTray(win);
  });
  win.webContents.on('render-process-gone', (e, details) => {
    const crashDetails = `崩溃原因: ${details.reason}, 退出码: ${details.exitCode}, 信号: ${details.signal}`;
    logger.error(`主窗口进程崩溃, ${crashDetails}`);
    const options = {
      type: 'error',
      title: '进程崩溃了',
      message: '这个进程已经崩溃.',
      buttons: ['重载', '退出']
    };
    recordCrash(details).then(() => {
      dialog.showMessageBox(options).then(({ response }) => {
        response === 0 ? reloadWindow(app) : app.quit();
      });
    }).catch(e => {
      console.log('记录日志失败:', e);
    });
  });
};

let isMainWinLoaded = false;
const createMainWindow = () => {
  win = new BrowserWindow({
    width: 1200,
    height: 720,
    minWidth: 1000,
    minHeight: 650,
    icon: iconPath,
    webPreferences: {
      backgroundThrottling: true,
      nodeIntegration: false,
      contextIsolation: true,
      preload: path.join(__dirname, '../preload.js'),
      sandbox: true
    },
    frame: false,
    show: false
  });
  if (process.env.VITE_DEV_SERVER_URL) {
    win.loadURL(process.env.VITE_DEV_SERVER_URL + 'index.html');
    dotenv.config({ path: '.env.development' });
  } else {
    win.loadFile(path.join(__dirname, '../dist/index.html'));
  };
  mainWindowConfigure();
  handleMainWindowEvents();
  updateTray(win);
};

let loginWindow;
const hanleLoginWindowEvents = () => {
  loginWindow.once('ready-to-show', () => loginWindow.show());
  loginWindow.on('close', () => {
    loginWindow = null;
  });
  loginWindow.webContents.on('render-process-gone', (e, details) => {
    const crashDetails = `崩溃原因: ${details.reason}, 退出码: ${details.exitCode}, 信号: ${details.signal}`;
    logger.error(`登录窗口进程崩溃: ${crashDetails}`);
    const options = {
      type: 'error',
      title: '进程崩溃了',
      message: '这个进程已经崩溃.',
      buttons: ['重载', '退出']
    };
    recordCrash(details).then(() => {
      dialog.showMessageBox(options).then(({ response }) => {
        response === 0 ? reloadWindow(app) : app.quit();
      });
    }).catch(e => {
      console.log('记录日志失败:', e);
    });
  });
};
const createLoginWindow = () => {
  if (loginWindow) return;
  loginWindow = new BrowserWindow({
    width: 870,
    height: 500,
    alwaysOnTop: true,
    icon: iconPath,
    webPreferences: {
      backgroundThrottling: true,
      nodeIntegration: false,
      contextIsolation: true,
      preload: path.join(__dirname, '../preload.js'),
      sandbox: true
    },
    transparent: true,
    frame: false
  });
  if (process.env.VITE_DEV_SERVER_URL) {
    loginWindow.loadURL(process.env.VITE_DEV_SERVER_URL + 'src/windows/login.html');
    dotenv.config({ path: '.env.development' });
  } else {
    loginWindow.loadFile(path.join(__dirname, '../dist/src/windows/login.html'));
  };
  // loginWindow.webContents.toggleDevTools();
  hanleLoginWindowEvents();
};

let playerWindow = new Proxy(
  {}, 
  {
    get: (target, prop) => {
      // 访问容器对象的值时，返回最新的 playerWindow
      return Reflect.get(target, prop);
    },
    set: (target, prop, value) => {
      // 如果修改了容器对象的值，即 playerWindow 使用Reflect 来操作对象
      return Reflect.set(target, prop, value);
    }
  }
);

const playerWindowConfigure =  () => {
  // playerWindow.value.webContents.openDevTools();
};
const hanlePlayerWindowEvents = () => {
  playerWindow.value.once('ready-to-show', () => playerWindow.value.show());
  playerWindow.value.on('close', () => {
    playerWindow.value = null;
  });
  playerWindow.value.webContents.on('render-process-gone', (e, details) => {
    const crashDetails = `崩溃原因: ${details.reason}, 退出码: ${details.exitCode}, 信号: ${details.signal}`;
    logger.error(`播放窗口进程崩溃: ${crashDetails}`);
    const options = {
      type: 'error',
      title: '进程崩溃了',
      message: '这个进程已经崩溃.',
      buttons: ['重载', '退出']
    };
    recordCrash(details).then(() => {
      dialog.showMessageBox(options).then(({ response }) => {
        response === 0 ? reloadWindow(app) : app.quit();
      });
    }).catch(e => {
      console.log('记录日志失败:', e);
    });
  });
};
const createPlayerWindow = () => {
  if (playerWindow.value) return;
  playerWindow.value = new BrowserWindow({
    width: 1050,
    height: 660,
    icon: iconPath,
    webPreferences: {
      backgroundThrottling: true,
      nodeIntegration: false,
      contextIsolation: true,
      preload: path.join(__dirname, '../preload.js'),
      sandbox: true
    },
    frame: false
  });
  if (process.env.VITE_DEV_SERVER_URL) {
    playerWindow.value.loadURL(process.env.VITE_DEV_SERVER_URL + 'src/windows/player.html');
    dotenv.config({ path: '.env.development' });
  } else {
    playerWindow.value.loadFile(path.join(__dirname, '../dist/src/windows/player.html'));
  };
  hanlePlayerWindowEvents();
  playerWindowConfigure();
};

let loadingWindow = null;
const createLoadingWindow = () => {
  loadingWindow = new BrowserWindow({
    width: 1200,
    height: 720,
    minWidth: 1000,
    minHeight: 750,
    icon: iconPath,
    webPreferences: {
      backgroundThrottling: true,
      nodeIntegration: false,
      contextIsolation: true,
      sandbox: true,
      preload: path.join(__dirname, '../preload.js')
    },
    frame: false,
    transparent: true,
    resizable: false,
    show: false
  });
  if (process.env.VITE_DEV_SERVER_URL) {
    loadingWindow.loadURL(process.env.VITE_DEV_SERVER_URL + 'src/windows/loading.html');
    dotenv.config({ path: '.env.development' });
  } else {
    loadingWindow.loadFile(path.join(__dirname, '../dist/src/windows/loading.html'));
  };
};

// 创建窗口的函数传递
const createWinCallback = R.always({
  createMainWindow,
  createLoginWindow,
  createPlayerWindow,
  createLoadingWindow
});

const getMainWindow = () => win;

const mainWindowActions = {
  getMainWindow
};

// 关闭登录窗口的回调
const closeLoginWinCallback = () => {
  if(loginWindow) loginWindow.close();
  loginWindow = null;
};
const getLoginWindow = () => loginWindow;
const loginWindowActions = {
  closeLoginWinCallback,
  createWinCallback
};

const closePlayerWinCallback = () => {
  if(playerWindow.value) playerWindow.value.close();
  playerWindow.value = null;
};
const mizePlayerWindow = () => {
  playerWindow.value.minimize();
};
const setPlayerFullScreen = isFull => {
  playerWindow.value.setFullScreen(!isFull);
};
const getPlayerWindow = () => playerWindow;
const reloadPlayerWindow = () => {
  if(!playerWindow.value) return;
  playerWindow.value.reload();
};
const playerActions = {
  closePlayerWinCallback,
  mizePlayerWindow,
  setPlayerFullScreen,
  createWinCallback,
  getPlayerWindow,
  reloadPlayerWindow
};

const closeLoadingWindow = () => {
  if(loadingWindow) {
    loadingWindow.close();
  };
  loadingWindow = null;
};
const getLoadingWindow = () => loadingWindow;
const loadingWindowActions = {
  closeLoadingWindow,
  getLoadingWindow
};

const commonActions = {
  getMainWindow,
  getPlayerWindow,
  getLoginWindow
};

const getTray = () => tray;
// 窗口删除后托盘更新
const updateTray = (mainWin) => {
  tray.setWin(mainWin);
};
const trayEvents = new TrayEvents(app, iconPath, createWinCallback);
// 创建托盘的回调
const createTrayCallback = () => {
  tray = trayEvents.createTray(app, iconPath, createWinCallback);
};

const recordCrash = (arg) => new Promise((resolve) => {
  logger.error(`进程崩溃: ${JSON.stringify(arg)}`);
  resolve();
});

const reloadWindow = (app) => {
  app.relaunch();
  app.exit(0);
};


// 不能对传递的参数重新赋值, 只能通过传递函数来赋值, 所有操作在主文件封装为函数后传递
// 闭包无法获取引用的最新值, 需要通过传递代理proxy在另一模块使用
const appEvents = new AppEvents({app, BrowserWindow, createWinCallback, createTrayCallback});
appEvents.appReady()
  .then(() => {
    appEvents.appLock(getMainWindow);
    appEvents.appClose(getTray, getMainWindow);
    appEvents.appSafe();
    mainWindowIpc(app, mainWindowActions);
    loginWindowIpc(loginWindowActions);
    playerWindowIpc(playerActions);
    loadingWindowIpc(loadingWindowActions, isMainWinLoaded);
    commomIpc(app, commonActions);
  });







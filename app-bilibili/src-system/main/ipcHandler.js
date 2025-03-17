import { ipcMain, nativeTheme } from 'electron';
import axios from 'axios';
import WebSocket from 'ws';
import zlib from 'zlib';

import fs from 'fs'; // 文件系统模块
import ffmpeg from 'ffmpeg-static'; // FFmpeg 静态可执行文件路径
import path from 'path';
import ping from 'ping';
import { execFile } from 'child_process'; // 执行可执行文件的工具
import { getConfig, setConfig, resetConfig } from './setting.js';
export default {
    mainWindowIpc(app, mainWindowActions) {
        const {
            getMainWindow
        } = mainWindowActions
        const mainWin = getMainWindow();
        /**
         * @param message 1为缩小2为退出
         */
        ipcMain.on('app_exit', (event, message) => {
            if(message === 0) {
                mainWin.minimize();
            }
            else if(message === 1) {
                app.quit();
            };
        });
        ipcMain.on('full_screen', (event, isFull) => {
            mainWin.setFullScreen(!isFull);
        });
        ipcMain.on('main_focus', () => {
            if (!mainWin.isVisible()) {
                mainWin.show(); // 确保窗口是可见的
            };
            mainWin.focus();
        });
        ipcMain.on('main_set_setting', (event, configJson) => {
            const config = JSON.parse(configJson);
            setConfig(config);
        });
        ipcMain.on('main_reset_setting', () => {
            resetConfig();
        });
        ipcMain.handle('main_get_system_color_mode', () => {
            return nativeTheme.shouldUseDarkColors;
        });
        ipcMain.on('main_update_automatic', (event, state) => {
            const isAutomatic = Boolean(state);
            app.setLoginItemSettings({
                // 是否开机自启动
                openAtLogin: isAutomatic,
                // 应用程序路径
                path: app.getPath('exe')
            });
        });
    },
    loginWindowIpc(loginActions) {
        const {
            createWinCallback, 
            closeLoginWinCallback
        } = loginActions;
        let { createLoginWindow } = createWinCallback();
        ipcMain.on('login_create', () => {
            createLoginWindow();
        });
        ipcMain.on('login_exit', () => {
            closeLoginWinCallback();
        }); 
    },
    playerWindowIpc(playerActions) {
        const {  
            closePlayerWinCallback,
            mizePlayerWindow,
            setPlayerFullScreen,
            createWinCallback,
            getPlayerWindow,
            reloadPlayerWindow,
            checkPlayerWindowExist
        } = playerActions;
        let { createPlayerWindow } = createWinCallback();
        ipcMain.on('player_create', (_event, data) => {
            const windowId = JSON.parse(data).windowId || '';
            // 如果playerWindow为null需要重新获取
            let playerWindow = getPlayerWindow();
            if(checkPlayerWindowExist(windowId)) {
                reloadPlayerWindow(windowId);
            }
            else {
                createPlayerWindow(windowId);
            };
            // 移除之前的回调
            playerWindow.value[windowId].webContents.removeAllListeners('did-finish-load');
            playerWindow.value[windowId].webContents.on('did-finish-load', () => {
                // 防止子组件未渲染完成就发送ipc消息
                playerWindow.value[windowId].webContents.send('get_windowId', windowId);
                ipcMain.removeAllListeners('did-child-finish-load');
                ipcMain.on('did-child-finish-load', (_event) => {
                    playerWindow.value[windowId].send('player_data_from_main', data);
                });
            });
            // 聚焦
            playerWindow.value[windowId].focus();
        });
        ipcMain.on('player_exit', (_event, data) => {
            const { windowId = '' } = JSON.parse(data);
            closePlayerWinCallback(windowId);
        });
        ipcMain.on('player_full_screen', (_event, data) => {
            const { windowId = '', isFull } = JSON.parse(data);
            setPlayerFullScreen(windowId, isFull);
        });
        ipcMain.on('player_zoom', (_event, data) => {
            const { windowId = '' } = JSON.parse(data);
            mizePlayerWindow(windowId);
        });
        ipcMain.on('player_reload', (_event, data) => {
            const { windowId = '' } = JSON.parse(data);
            reloadPlayerWindow(windowId);
        });
        ipcMain.on('player_focus', (_event, data) => {
            const { windowId = '' } = JSON.parse(data);
            if(!windowId || typeof windowId != 'string') throw new Error('playerWindow 索引不存在');
            let playerWindow = getPlayerWindow();
            if(!checkPlayerWindowExist(windowId)) {
                createPlayerWindow(windowId);
                playerWindow.value[windowId].webContents.removeAllListeners('did-finish-load');
                playerWindow.value[windowId].webContents.on('did-finish-load', () => {
                    playerWindow.value[windowId].webContents.send('get_windowId', windowId);
                    ipcMain.removeAllListeners('did-child-finish-load');
                    ipcMain.on('did-child-finish-load', (_event) => {
                        playerWindow.value[windowId].send('player_data_from_main', data);
                    });
                });
                playerWindow.value[windowId].focus();
            }
            else {
                if (!playerWindow.value[windowId].isVisible()) {
                    playerWindow.value[windowId].show(); // 确保窗口是可见的
                };
                playerWindow.value[windowId].focus();
            };
        });
        ipcMain.on('player_set_top', (_event, data) => {
            const { windowId = '', isTop } = JSON.parse(data);
            let playerWindow = getPlayerWindow();
            if(checkPlayerWindowExist(windowId)) {
                playerWindow.value[windowId].setAlwaysOnTop(isTop);
            }
            else {
                throw new Error('playerWindow 不存在');
            };
        });
        ipcMain.on('player_live_package', async (_event, data) => {
            let playerWindow = getPlayerWindow();
            let ws = null;
            let timer = null;
            const { host, wssPort, roomid, key, uid } = JSON.parse(data);
            // 封装为指定格式包
            function encodePacket(op, body) {
                const headerLength = 16;
                const protocol = 1;
                const type = op;
                const sequence = 2;
                const bodyBuffer = Buffer.from(JSON.stringify(body));
                const headerBuffer = Buffer.alloc(headerLength);
                // 大端序写入数据
                headerBuffer.writeUInt32BE(headerLength + bodyBuffer.length, 0);
                headerBuffer.writeUInt16BE(headerLength, 4);
                headerBuffer.writeUInt16BE(protocol, 6);
                headerBuffer.writeUInt32BE(type, 8);
                headerBuffer.writeUInt32BE(sequence, 12);
            
                return Buffer.concat([headerBuffer, bodyBuffer]);
            };
             
            async function getDmMsg(data) {
                // 获取数据包长度，协议类型和操作类型
                const packetLen = parseInt(data.slice(0, 4).toString('hex'), 16);
                const proto = parseInt(data.slice(6, 8).toString('hex'), 16);
                const op = parseInt(data.slice(8, 12).toString('hex'), 16);
                // 若数据包是连着的，则根据第一个数据包的长度进行切分
                if (data.length > packetLen) {
                    getDmMsg(data.slice(packetLen));
                    data = data.slice(0, packetLen);
                };
        
                // 判断协议类型，若为 2 则用 zlib 解压
                if (proto === 2) {
                    data = zlib.inflateSync(data.slice(16));
                    getDmMsg(data);
                    return;
                };
        
                if (op === 3) {
                    console.log('HeartBeat');
                };
        
                // 判断消息类型
                if (op === 5) {
                    try {
                        if(!checkPlayerWindowExist('live')) {
                            closeConnection();
                        } else {
                            playerWindow.value['live'].webContents.send('get_live_package', data.slice(16).toString())
                        };
                    } catch (e) {
                        console.error(`[GETDATA ERROR]: ${e}`);
                    };
                };
            };
 
            // 连接 WebSocket
            const connectDanmakuStream = async ({ roomid, host, wssPort, uid = 0, key }) => {
                if (!roomid) {
                    console.error('房间号为空');
                    return;
                };
                const url = 'wss://' + host + ':' + wssPort + '/sub';
                ws = new WebSocket(url, {
                    headers: {
                        'User-Agent': 'Mozilla/5.0 (X11; Linux x86_64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/131.0.0.0 Safari/537.36',
                        'Origin': 'https://live.bilibili.com',
                        'Upgrade': 'websocket',
                        'Connection': 'Upgrade',
                        'Sec-WebSocket-Extensions': 'permessage-deflate; client_max_window_bits',
                        'Sec-WebSocket-Version': '13',
                        'Host': host,
                    }
                });
                ws.on('open', () => {
                    const authData = {
                        roomid,
                        uid,
                        key,
                        platform: 'web',
                        type: 2,
                        // 协议版本为 2返回json格式数据， 3返回brotil压缩数据
                        protover: 2,
                    };
                    const authPacket = encodePacket(7, authData);
                    if(ws.readyState === WebSocket.OPEN) {
                        ws.send(authPacket);
                    };
                });

                ws.on('message', async (data) => {
                    if(data instanceof Buffer) {
                        getDmMsg(data);
                    };
                }); 

                ws.on('error', (error) => {
                    console.error('WebSocket 错误:', error);
                });

                ws.on('close', (code, reason) => {
                    console.log('WebSocket 连接关闭', code, reason);
                    timer && clearInterval(timer);
                });
 
                // 发送心跳包
                timer = setInterval(() => {
                    const heartbeatPacket = encodePacket(2, {});
                    ws.send(heartbeatPacket);
                    console.log('发送心跳包');
                }, 30000);
            };
            const closeConnection = () => {
                ws?.close(1000, '主动关闭');
                ws = null;
                if (timer) clearInterval(timer);
                timer = null;
            };
            connectDanmakuStream({ roomid, host, wssPort, uid, key });
            ipcMain.removeAllListeners('player_stop_live_package');
            ipcMain.on('player_stop_live_package', () => {
                closeConnection();
            });
        });
    }, 
    loadingWindowIpc(loadingActions, isMainWinLoaded) {
        const {
            closeLoadingWindow,
            getLoadingWindow
        } = loadingActions;
        ipcMain.on('loading_logo_loaded', () => {
            const loadingWindow = getLoadingWindow();
            if(isMainWinLoaded) {
                closeLoadingWindow();
            }
            else {
                loadingWindow.show();
            };
        });
    },
    // 涉及到多个窗口
    commomIpc(app, commonActions) {
        const {
            checkPlayerWindowExist,
            getMainWindow,
            getPlayerWindow,
            getLoginWindow,
        } = commonActions;
        const request = axios.create({
            timeout: 10000
        });
        request.interceptors.request.use(
            (config) => {
                return config;
            },
            (error) => {
                console.error('请求发送失败:', error);
                return Promise.reject(error);
            }
        );
        ipcMain.on('vuex_update_from_login', (_event, message) => {
            const mainWindow = getMainWindow();
            const playerWindow = getPlayerWindow();
            if(mainWindow) mainWindow.webContents.send('update_login_to_main', message);
            const { windowId = '' } = JSON.parse(message);
            if(checkPlayerWindowExist(windowId)) playerWindow.value[windowId].webContents.send('update_login_to_player');
        });
        ipcMain.on('check_internet', async (_event, data) => {
            const mainWindow = getMainWindow();
            const playerWindow = getPlayerWindow();
            const { windowId = '' } = JSON.parse(data);
            try {
                // 使用 promise.probe 方法来发送 ping 请求检查网络状态
                const res = await ping.promise.probe('baidu.com');
                if(mainWindow) mainWindow.webContents.send('status_internet', res.alive);
                if(checkPlayerWindowExist(windowId)) playerWindow.value[windowId].webContents.send('status_internet', res.alive);
            } catch (error) {
                console.error('检查网络状态失败', error);
            };
        });
        ipcMain.on('update_font', (_event, message) => {
            const mainWindow = getMainWindow();
            const playerWindow = getPlayerWindow();
            const loginWindow = getLoginWindow();
            const { windowId = '' } = JSON.parse(message);
            if(mainWindow) mainWindow.webContents.send('update_font_to_main', message);
            if(checkPlayerWindowExist(windowId)) playerWindow.value[windowId].webContents.send('update_font_to_player', message);
            if(loginWindow) loginWindow.webContents.send('update_font_to_login', message);
        });
        ipcMain.handle('get_setting', () => {
            const config = getConfig();
            return config;
        });
    }
};

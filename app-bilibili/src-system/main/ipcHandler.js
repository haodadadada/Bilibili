import { ipcMain, nativeTheme  } from 'electron';
import axios from 'axios';
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
            reloadPlayerWindow
        } = playerActions;
        let { createPlayerWindow } = createWinCallback();
        ipcMain.on('player_create', (e, data) => {
            // 如果playerWindow为null需要重新获取
            let playerWindow = getPlayerWindow();
            if(playerWindow.value) {
                reloadPlayerWindow();
            }
            else {
                createPlayerWindow();
            };
            // 移除之前的回调
            playerWindow.value.webContents.removeAllListeners('did-finish-load');
            playerWindow.value.webContents.on('did-finish-load', () => {
                playerWindow.value.send('video_data_from_main', data);
            });
            // 聚焦
            playerWindow.value.focus();
        });
        ipcMain.on('player_exit', () => {
            closePlayerWinCallback();
        });
        ipcMain.on('player_full_screen', (event, isFull) => {
            setPlayerFullScreen(isFull);
        });
        ipcMain.on('player_zoom', () => {
            mizePlayerWindow();
        });
        ipcMain.on('player_reload', () => {
            reloadPlayerWindow();
        });
        ipcMain.on('player_focus', (e, data) => {
            let playerWindow = getPlayerWindow();
            if(!playerWindow.value) {
                createPlayerWindow();
                playerWindow.value.webContents.removeAllListeners('did-finish-load');
                playerWindow.value.webContents.on('did-finish-load', () => {
                    playerWindow.value.send('video_data_from_main', data);
                });
                playerWindow.value.focus();
            }
            else {
                if (!playerWindow.value.isVisible()) {
                    playerWindow.value.show(); // 确保窗口是可见的
                };
                playerWindow.value.focus();
            };
        });
        ipcMain.on('player_set_top', (e, isTop) => {
            let playerWindow = getPlayerWindow();
            if(playerWindow.value) {
                playerWindow.value.setAlwaysOnTop(isTop);
            };
        })
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
            getMainWindow,
            getPlayerWindow,
            getLoginWindow
        } = commonActions;
        const request = axios.create({
            timeout: 10000
        });
        request.interceptors.request.use(
            (config) => {
                console.log(config.headers);
                return config;
            },
            (error) => {
                console.error('请求发送失败:', error);
                return Promise.reject(error);
            }
        );
        ipcMain.on('vuex_update_from_login', (event, message) => {
            const mainWindow = getMainWindow();
            const playerWindow = getPlayerWindow();
            if(mainWindow) mainWindow.webContents.send('update_login_to_main', message);
            if(playerWindow.value) playerWindow.value.webContents.send('update_login_to_player', message);
        });
        ipcMain.on('check_internet', async () => {
            const mainWindow = getMainWindow();
            const playerWindow = getPlayerWindow();
            try {
                // 使用 promise.probe 方法来发送 ping 请求检查网络状态
                const res = await ping.promise.probe('baidu.com');
                if(mainWindow) mainWindow.webContents.send('status_internet', res.alive);
                if(playerWindow.value) playerWindow.value.webContents.send('status_internet', res.alive);
            } catch (error) {
                console.error('检查网络状态失败', error);
            };
        });
        ipcMain.on('update_font', (e, message) => {
            const mainWindow = getMainWindow();
            const playerWindow = getPlayerWindow();
            const loginWindow = getLoginWindow();
            if(mainWindow) mainWindow.webContents.send('update_font_to_main', message);
            if(playerWindow.value) playerWindow.value.webContents.send('update_font_to_player', message);
            if(loginWindow) loginWindow.webContents.send('update_font_to_login', message);
        });
        ipcMain.handle('get_setting', () => {
            const config = getConfig();
            return config;
        });
        ipcMain.on('download_video', async (e, data) => {
            const { bvid = '', cid = '', sessdata = '', videoId = 32, audioId = 30216 } = data;
            if(!bvid || !cid) {
                return;
            };
            try {
                const URL_HOME_VIDEO_PLAYER = 'https://api.bilibili.com/x/player/wbi/playurl';
                const response = await axios({
                    url: URL_HOME_VIDEO_PLAYER,
                    method: 'GET',
                    headers: {
                        "Cookie": sessdata ? `SESSDATA=${sessdata}` : '',
                        'Referer': 'https://www.bilibili.com/',
                        'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/124.0.0.0 Safari/537.36',
                        'Origin': 'https://www.bilibili.com'
                    },
                    params: {
                        bvid,
                        cid,
                        fnval: 16
                    }
                });
                const result = response.data;
                const videoOptions = result.data.dash.video;
                const audioOptions = result.data.dash.audio;
                const videoUrl = videoOptions.filter(video => video.id === videoId)[0].baseUrl || '';
                const audioUrl = audioOptions.filter(audio => audio.id === audioId)[0].baseUrl || '';
                async function downloadFile(url, outputPath) {
                    const writer = fs.createWriteStream(outputPath);
                    try {
                        const response = await axios({
                        url,
                        method: 'GET',
                        responseType: 'stream',
                        headers: {
                            'Referer': 'https://www.bilibili.com/',
                            'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/124.0.0.0 Safari/537.36',
                            'Origin': 'https://www.bilibili.com'
                        }
                        });
                        
                        // pipe为nodejs内置方法，用于流数据的传输
                        response.data.pipe(writer);
                    
                        return new Promise((resolve, reject) => {
                        writer.on('finish', resolve);
                        writer.on('error', reject);
                        });
                    } catch (error) {
                        // console.error(`下载文件失败: ${url}`, error);
                        throw error;
                    }
                };
                
                // 合并音视频文件
                function mergeM4S(videoPath, audioPath, outputPath) {
                    return new Promise((resolve, reject) => {
                        // FFmpeg 合并命令
                        const args = [
                            '-i', videoPath,
                            '-i', audioPath,
                            '-c:v', 'copy',
                            '-c:a', 'copy',
                            '-f', 'mp4',
                            outputPath,
                            '-loglevel', 'quiet',
                            '-fflags', '+genpts',
                            '-avoid_negative_ts', 'make_zero',
                            '-itsoffset', '0.0',
                            '-map', '0:v:0',
                            '-map', '1:a:0'
                        ];
                    
                        // 运行命令 调用 FFmpeg
                        execFile(ffmpeg, args, (error, stdout, stderr) => {
                            if (error) {
                                reject(error);
                                return;
                            };
                            resolve(outputPath);
                        });
                    });
                };
                
                // 主逻辑：下载并合并视频和音频
                async function downloadAndMerge(videoUrl, audioUrl, outputFileName) {
                    try {
                        const tempDir = path.join(app.getAppPath(), 'videos-download');
                        if (!fs.existsSync(tempDir)) {
                            fs.mkdirSync(tempDir);
                        };
                        const videoPath = path.join(tempDir, 'video.m4s');
                        const audioPath = path.join(tempDir, 'audio.m4s');
                        const outputPath = path.join(tempDir, outputFileName);
                        // 下载视频和音频文件
                        await downloadFile(videoUrl, videoPath);
                        await downloadFile(audioUrl, audioPath);
                        // 合并音视频
                        const result = await mergeM4S(videoPath, audioPath, outputPath);
                        // 删除临时文件
                        fs.unlinkSync(videoPath);
                        fs.unlinkSync(audioPath);
                        return result;
                    } catch (error) {
                        console.error('下载或合并失败');
                        throw error;
                    };
                };
                // 示例调用
                const outputFileName = 'output.mp4';
                
                downloadAndMerge(videoUrl, audioUrl, outputFileName)
                    .then((outputFile) => {
                        console.log('最终合并文件路径:', outputFile);
                    })
                    .catch((err) => {
                        console.error('处理失败:', err);
                    });
                
            } catch(error) {
                console.log('下载视频失败', error);
            };
        });
    }
};

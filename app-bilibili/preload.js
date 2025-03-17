const { contextBridge, ipcRenderer } = require('electron');

// 安全地将 API 暴露给渲染进程
contextBridge.exposeInMainWorld('electronAPI', {
    // 从主进程发送数据到渲染进程
    send: (channel) => {
        // 限制可以使用的通道
        let validChannels = [
            'toMain', 
            'did-child-finish-load', 
            'login_create', 
            'login_exit', 
            'main_focus',
            'player_stop_live_package'
        ];
        if (validChannels.includes(channel)) {
            ipcRenderer.send(channel);
        }
    },
    receive: (channel, func) => {
        let validChannels = [
            'update_login_to_main', 
            'player_data_from_main',
            'status_internet', 
            'setting_data_from_main', 
            'update_font_to_main', 
            'update_font_to_player', 
            'update_font_to_login',
            'update_login_to_player',
            'get_windowId',
            'get_live_package'
        ];
        if (validChannels.includes(channel)) {
            // 限制可以使用的通道
            const callback = (_event, ...args) => func(...args)
            ipcRenderer.on(channel, callback);
            return () => ipcRenderer.removeListener(channel, callback);
        } else {
            return null;
        };
    },
    exitApp: callback => {
        // 渲染进程监听事件, 在有边框窗口的条件下使用 监听 win的close事件
        ipcRenderer.on('main_exit', callback);
    },
    sendMessage: (channel, ...args) => ipcRenderer.send(channel, ...args),
    invoke: async (channel, ...args) => {
        // 添加对 channel 的安全检查
        if (typeof channel !== 'string') {
            throw new Error('Channel must be a string');
        };
        return ipcRenderer.invoke(channel, ...args).catch((error) => {
            console.error(`Error invoking channel "${channel}":`, error);
            throw error; // 继续向上传播错误
        });
    }
});

class AppEvents {
    constructor({app, BrowserWindow, createWinCallback, createTrayCallback}) {
        this.app = app;
        this.BrowserWindow = BrowserWindow;
        this.createWinCallback = createWinCallback;
        this.createTrayCallback = createTrayCallback;
    };

    appReady() {
        return new Promise((resolve, reject) => {
            this.app.whenReady().then(() => {
                try {
                    this.createWinCallback().createLoadingWindow();
                    this.createTrayCallback();
                    this.createWinCallback().createMainWindow();
                    this.app.on('activate', () => {
                        if (this.BrowserWindow.getAllWindows().length === 0) {
                            this.createWinCallback().createMainWindow();
                        };
                    });
                    resolve();
                } catch(e) {
                    reject(e);
                };
            });
        });
    };

    appLock(getMainWindow) {
        const gotLock = this.app.requestSingleInstanceLock();
        const win = getMainWindow();
        if (!gotLock) {
            this.app.quit();
        } else {
            this.app.on('second-instance', () => {
                if (win) {
                    if (win.isMinimized()) this.win.restore();
                    win.focus();
                };
            });
        };
    };

    appClose(getTray, getMainWindow) {
        const tray = getTray();
        let win = getMainWindow();
        this.app.on('before-quit', () => {
            if (tray) {
                tray.destroy();
            };
            win = null;
        });
    };

    appSafe() {
        this.app.on('web-contents-created', (event, contents) => {
            contents.on('will-navigate', (event, navigationUrl) => {
                event.preventDefault();
            });
            contents.setWindowOpenHandler(({ url }) => {
                if (url.startsWith('')) {
                    return { action: 'allow' };
                } else {
                    return { action: 'deny' };
                };
            });
            contents.on('will-attach-webview', (event, webPreferences, params) => {
                event.preventDefault();
            });
        });
    };
};

export default AppEvents;

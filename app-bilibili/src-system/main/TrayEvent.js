import { Menu, Tray } from 'electron';
/**
 * 
 * @param {*} app 
 * @param {*} iconPath 
 * @returns {*} 返回tray通过setWin来修改tray.win
 */
class TrayEvents {
    constructor(app, iconPath, createWinCallback) {
        this.app = app;
        this.iconPath = iconPath;
        this.createWinCallback = createWinCallback;
        this.tray = null; // 用于存储 Tray 实例
    }

    createTray() {
        // 如果已有 Tray 实例，销毁旧的
        if (this.tray) {
            this.tray.destroy();
        };

        // 创建新的 Tray 实例
        this.tray = new Tray(this.iconPath);
        this.tray.setToolTip('bilibili');

        // 绑定事件
        this.#bindClickEvent();
        this.#bindRightClickEvent();

        // 为 Tray 实例添加方法来设置关联的窗口
        this.tray.setWin = (win) => {
            this.tray.win = win;
        };
        return this.tray;
    }

    #bindClickEvent() {
        this.tray.on('click', () => {
            if (this.tray.win) {
                // 切换窗口的显示和隐藏状态
                this.tray.win.isVisible() ? this.tray.win.hide() : this.tray.win.show();
            } else {
                // 如果没有窗口实例，调用回调创建主窗口
                const { createMainWindow } = this.createWinCallback();
                createMainWindow();
            }
        });
    }

    #bindRightClickEvent() {
        this.tray.on('right-click', () => {
            const menuConfig = Menu.buildFromTemplate([
                {
                    label: '退出',
                    click: () => {
                        this.app.quit();
                    }
                }
            ]);
            this.tray.popUpContextMenu(menuConfig);
        });
    }
}

export default TrayEvents;
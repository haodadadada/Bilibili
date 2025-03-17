
// 扩展
export interface ElectronAPI {
    sendMessage: (channel: string, data?: any) => void;
    // 你可以根据实际情况添加更多的 API
    receiveMessage?: (channel: string, callback: (event: any, ...args: any[]) => void) => void;
    exitApp: (callback: Function) => void;
    send: (channel: string, data?: any) => void;
    receive: (channel: string, callback: (event: any, ...args: any[]) => void) => null;
    invoke: <T>(channel: string, data?: any) => Promise<T>;
};
declare global {
    interface Window {
        electronAPI: ElectronAPI
    };
};
declare module '*.vue' {
    import { DefineComponent } from 'vue';
    const component: DefineComponent<{}, {}, any>;
    export default component;
};

declare module 'md5' {
    function md5(message: string): string;
    export = md5;
};

declare const ElMessage: {
    success: (msg: string) => void;
    error: (msg: string) => void;
    warning: (msg: string) => void;
    info: (msg: string) => void;
};

// src/global.d.ts
declare function initGeetest(options: {
    gt: string,
    challenge: string,
    offline: boolean,
    new_captcha: boolean,
    product?: string,
    area?: string,
    next_width?: string,
    https?: boolean
}, callback: (captchaObj: any) => void): void;


declare module 'eslint-plugin-vue' {
    const plugin: any;
    export = plugin;
};

// html
declare module '*.html';
// css
declare module '*.css';

declare module 'https://unpkg.com/brotli-wasm@3.0.0/index.web.js?module' {
    const brotli: any;
    export default brotli;
};

declare module "*.svg" {
    import { DefineComponent } from 'vue';
    const content: DefineComponent<{}, {}, any>;
    export default content;
};
import { createApp } from 'vue';
import App from './App.vue';
import router from './router/index';
import store from './store/index';
import * as echarts from 'echarts';
import 'element-plus/dist/index.css';
import '@/common/css/index/index.scss';
import '@/common/css/font/font.css';
import '@/common/css/fixed/light.scss';
import '@/common/css/fixed/map.scss';
import '@/common/css/fixed/index.scss';
import '@/Tailwind.css';
import lazyload from '@/plugins/directive/lazyload/index';
import slideIn from '@/plugins/directive/slide-in/index';
import skeleton from '@/plugins/directive/skeleton/index';
const app = createApp(App);
app.config.globalProperties.$echarts = echarts;
app.directive('debounce', {
    mounted(el, binding) {
     // 至少需要回调函数以及监听事件类型
        if (typeof binding.value.fn !== 'function' || !binding.value.event) return;
        const delay = 200; // 默认延迟时间
        el.timer = null;
        el.handler = function(...args: unknown[]): void {
            if (el.timer) {
                clearTimeout(el.timer);
                el.timer = null;
            };
            el.timer = setTimeout(() => {
                binding.value.fn.apply(this, ...args);
                el.timer = null;
            }, binding.value.delay || delay);
        };
        el.addEventListener(binding.value.event, el.handler);
    },
    // 元素卸载前也记得清理定时器并且移除监听事件
    beforeUnmount(el, binding) {
        if (el.timer) {
            clearTimeout(el.timer);
            el.timer = null;
        };
        el.removeEventListener(binding.value.event, el.handler);
    }
});
app.directive('throttle', {
    mounted(el, binding) {
        // 至少需要回调函数以及监听事件类型
        if (typeof binding.value.fn !== 'function' || !binding.value.event) return;
        const delay = 200;
        el.timer = null;
        el.handler = function(...args: unknown[]): void {
          if (el.timer) return;
          binding.value.fn.apply(this, ...args);
          el.timer = setTimeout(() => {
            el.timer = null;
          }, binding.value.delay || delay);
        };
        el.addEventListener(binding.value.event, el.handler);
    },
    // 元素卸载前也记得清理定时器并且移除监听事件
    beforeUnmount(el, binding) {
        if (el.timer) {
            clearTimeout(el.timer);
            el.timer = null;
        };
        el.removeEventListener(binding.value.event, el.handler);
    }
});
app.directive('slide-in', {
    ...slideIn
});
app.directive('lazyload', {
    ...lazyload
});
app.directive('skeleton', {
    ...skeleton
});
app.use(store).use(router).mount('#app');
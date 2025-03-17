interface ElementHandler extends HTMLElement {
    resizeHandler: (event?: Event) => void;
};

/**
 * 对传入的容器元素下的video元素进行宽高比适配
 * @param parentEl 容器元素
 * @param ratio 宽高比
 * @returns 
 */
const handleResize = (parentEl?: ElementHandler, ratio: number | null = null) => (_event?: Event) => {
    if(parentEl) {
        const parentWidth: number = parentEl.offsetWidth;
        const parentHeight: number = parentEl.offsetHeight;
        const video: HTMLVideoElement | null = parentEl.querySelector('video');
        if(ratio != null && video) {
            // 选出短边 使video为100%
            if(Number((parentHeight * ratio).toFixed(2)) < parentWidth) {
                // 高为短边
                video.style.height = '100%';
                video.style.width = 'auto';
            } else {
                // 宽为短边
                video.style.width = '100%';
                video.style.height = 'auto';
            };
        };
    };
};
export default {
    mounted(el: ElementHandler, binding: { value: {ratio: number} }) {
        const ratio = binding.value.ratio;
        const resizeHandler = handleResize(el, ratio);
        el.resizeHandler = resizeHandler;
        window.addEventListener('resize', resizeHandler);
        resizeHandler();
    },
    unmounted(el: ElementHandler) {
        window.removeEventListener('resize', el.resizeHandler);
    }
};
// 使用 WeakMap 不会导致垃圾回收，仍然可以正常回收
const animationMap: WeakMap<Element, Animation> = new WeakMap();

// 监听元素是否与某个东西重叠，默认是视口
const ob = new IntersectionObserver((entries: IntersectionObserverEntry[]) => {
    for (const entry of entries) {
        if (entry.isIntersecting) {
            const animation = animationMap.get(entry.target);
            if (animation) {
                animation.play();
            };
            ob.unobserve(entry.target);
        };
    };
});

// 判断元素是否在视口下方
function isBelowViewport(el: Element): boolean {
    const rect = el.getBoundingClientRect();
    return rect.top > window.innerHeight;
};

export default {
    mounted(el: Element) {
        if (!isBelowViewport(el)) {
            return;
        }

        // 使用 Web Animations API 实现动画
        const animation = el.animate(
            [
                // 关键帧
                {
                    transform: 'translateY(100px)',
                    opacity: 0,
                },
                {
                    transform: 'translateY(0px)',
                    opacity: 1,
                },
            ],
            {
                duration: 1000,
                easing: 'ease',
            }
        );

        animation.pause();
        animationMap.set(el, animation);
        // 监听该元素
        ob.observe(el);
    },
    // 元素卸载时取消监听
    unmounted(el: Element) {
        ob.unobserve(el);
    },
};

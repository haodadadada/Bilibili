// 为 WeakMap 和 IntersectionObserver 指定类型
const imgMap: WeakMap<Element, string> = new WeakMap();

const ob = new IntersectionObserver((entries: IntersectionObserverEntry[]) => {
    for (const entry of entries) {
        if (entry.isIntersecting) {
            const target = entry.target as HTMLImageElement; // 断言 target 为 HTMLImageElement
            const imgUrl = imgMap.get(target);
            if (imgUrl) {
                target.src = imgUrl;
                target.setAttribute('data-isload', 'true');
                ob.unobserve(target);
            };
        };
    };
});

export default {
    mounted(el: HTMLImageElement, binding: { value: string }) {
        // 当元素首次挂载时执行
        const imgUrl = binding.value;
        imgMap.set(el, imgUrl);
        ob.observe(el); // 开始观察该元素
    },
    updated(el: HTMLImageElement, binding: { value: string; oldValue: string | null }) {
        // 当绑定的值更新时执行
        if (binding.value === binding.oldValue) return;
        
        const imgUrl = binding.value;
        el.removeAttribute('data-isload');
        imgMap.set(el, imgUrl);
        ob.observe(el); // 重新观察该元素
    },
    unmounted(el: HTMLImageElement) {
        // 当元素卸载时执行
        ob.unobserve(el); // 停止观察
        imgMap.delete(el); // 删除弱引用
    }
};

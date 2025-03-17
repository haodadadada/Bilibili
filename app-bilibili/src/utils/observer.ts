/**
 * 传入一个sentinel元素, 通过IntersectionObserver监听元素是否进入视口, 进入视口时触发回调函数, 支持配置
 * 可以用于实现懒加载, 无限滚动等功能
 * 
 * @param sentinel 
 * @param options 
 * @param fn --函数需要做出限制条件, 反复滑动时会频繁触发
 * @param args --剩余参数需要按照形参顺序
 * @returns 
 */


// fn为 闭包函数 仍然可以获取上下文访问参数
export default function(sentinel: HTMLElement | null, options: Record<string, any>, fn: (...args: any[]) => void): IntersectionObserver | null {
    let errorCount = 0;
    const errorMax = 5;
    const observer: IntersectionObserver = new IntersectionObserver(entries => {
        entries.forEach(async entry => {
            if(entry.isIntersecting) {
                // 同步的 try/catch 不能捕获异步操作中的错误。需要await来处理
                try {
                    await fn();
                } catch(err: unknown) {
                    console.log(err);
                    if(errorCount > errorMax) {
                        observer.disconnect();
                    };
                    errorCount++;
                    if(err instanceof Error) {
                        throw new Error('监听元素回调函数执行错误', err);
                    }
                    else {
                        throw new Error('监听元素回调函数执行错误');
                    };
                };
            };
        });
    }, {
        root: null, // 使用视口作为根元素 
        rootMargin: '0px 0px 500px 0px',
        threshold: 0, // 触发回调时不需要完全可见
        ...options
    });
    if(sentinel) {
        observer.observe(sentinel);
        return observer;
    }
    else {
        return null;
    };
};
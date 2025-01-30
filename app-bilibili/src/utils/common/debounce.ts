/**
 * 
 * @param {Function} func 需要执行的函数
 * @param {Number} delay 延迟的时间
 * @returns {Function} 返回一个新函数，该函数接收的第一个参数为对象 `options`，其中 `isFirst` 字段表示是否需要立即执行，`containerRef` 表示需要设置的元素
 */
type FuncType = (...args: any[]) => void;

export default function debounce<T extends FuncType>(func: T, delay: number = 500) {
    let timer: ReturnType<typeof setTimeout> | null;

    // 定义函数并为 this 设置正确的类型
    const debounced = function(this: unknown, ...args: Parameters<T>) {
        if (timer) {
            clearTimeout(timer);
            timer = null;
        }
        timer = setTimeout(() => {
            // 调用 func 时，保留 this 上下文和参数
            func.apply(this, args);
        }, delay);
    };

    // 定义取消防抖功能的方法
    debounced.cancel = function() {
        if (timer) {
            clearTimeout(timer);
            timer = null;
        };
    };

    return debounced;
}

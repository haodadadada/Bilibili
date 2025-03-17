/**
 * @description 防抖函数
 * @param {Function} func 需要执行的函数
 * @param {Number} delay 延迟的时间
 * @returns {Function} 返回一个Promise函数
 */
type FuncType = (...args: any[]) => void;

export default function debounce<T extends FuncType>(func: T, delay: number = 500) {
    let timer: ReturnType<typeof setTimeout> | null;

    // 定义函数并为 this 设置正确的类型
    const debounced = function(this: unknown, ...args: Parameters<T>) {
        return new Promise((resolve) => {
            if (timer) {
                clearTimeout(timer);
                timer = null;
            }
            timer = setTimeout(async () => {
                // 调用 func 时，保留 this 上下文和参数
                const result = await func.apply(this, args);
                resolve(result);
            }, delay);
        });
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

type FuncType = (...args: any[]) => void;

export default function once<T extends FuncType>(func: T, times = 1) {
    let nowTimes = 0;
    let result: unknown;
    return function(this: any, ...args: any[]) {
        if(nowTimes < times) {
            // 返回函数的this执行调用对象，不使用call显示设置的话返回函数内的func的this为全局对象
            result = func.call(this, ...args);
            nowTimes++;
            return result;
        }
        else {
            return result;
        }   
    }; 
}
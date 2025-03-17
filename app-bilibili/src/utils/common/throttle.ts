type FuncType = (...args: any[]) => void;
export default function<T extends FuncType>(func: T, delay = 500) {
    let wait = false;
    return function(...args: any[]) {
        if(wait) {
            return;
        }
        else {
            wait = true;
            func(...args);
            setTimeout(() => {
                wait = false;
            }, delay);
        }
    };
};
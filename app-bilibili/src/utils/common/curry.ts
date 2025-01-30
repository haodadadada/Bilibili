type FuncType = (...args: any[]) => any;
export default function<T extends FuncType>(func: T, arity: number = func.length) {
    return function curried(...args: any[]): any {
        if(arity >= args.length) {
            return func(...args);
        }
        else {
            return function(...moreArgs: any[]) {
                return curried(...args, ...moreArgs);
            };
        };
    };
};
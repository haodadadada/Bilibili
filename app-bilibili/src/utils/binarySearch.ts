import * as R from 'ramda';
export default R.curry((arr: number[], target: number) => {
    if(arr.length === 0) return null;
    const search = (left: number, right: number): number | null => {
        if(left > right) return null;
        const mid = Math.floor((left + right) / 2);
        if(arr[mid] === target) return mid;
        else if(arr[mid] < target) return search(mid + 1, right);
        else return search(left, mid - 1);
    };
    return search(0, arr.length - 1);
});
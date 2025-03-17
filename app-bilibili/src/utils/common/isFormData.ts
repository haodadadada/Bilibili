const isFormData = (v: unknown): boolean => {
    return Object.prototype.toString.call(v) === '[object FormData]';
};
export {
    isFormData
};
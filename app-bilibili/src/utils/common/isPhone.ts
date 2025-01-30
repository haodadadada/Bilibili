export function isPhone (phone: string) {
    const reg = /^1\d{10}$/;
    const flag = reg.test(phone);
    return flag;
};
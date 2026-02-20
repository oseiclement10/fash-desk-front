export const generateReference = (prefix: string = "BFS-ADMI-PAY" ) => {
    const randomStr = Math.random().toString(36).substring(2, 8).toUpperCase();
    return `${prefix}-${randomStr}`;
};
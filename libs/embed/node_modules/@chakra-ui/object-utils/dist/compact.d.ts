declare function compact<T extends Record<any, any>>(object: T): {} & T;

export { compact };

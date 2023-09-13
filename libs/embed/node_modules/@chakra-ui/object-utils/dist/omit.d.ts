declare function omit<T extends Record<string, any>, K extends keyof T>(object: T, keysToOmit?: K[]): Omit<T, K>;

export { omit };

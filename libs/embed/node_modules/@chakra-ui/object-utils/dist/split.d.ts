declare function split<T extends Record<string, any>, K extends keyof T>(object: T, keys: K[]): [{ [P in K]: T[P]; }, Omit<T, K>];

export { split };

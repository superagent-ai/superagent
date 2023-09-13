declare function pick<T extends Record<string, any>, K extends keyof T>(object: T, keysToPick: K[]): { [P in K]: T[P]; };

export { pick };

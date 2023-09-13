export declare const noop: () => void;
export declare function on<T extends Window | Document | HTMLElement | EventTarget>(obj: T | null, ...args: Parameters<T['addEventListener']> | [string, Function | null, ...any]): void;
export declare function off<T extends Window | Document | HTMLElement | EventTarget>(obj: T | null, ...args: Parameters<T['removeEventListener']> | [string, Function | null, ...any]): void;
export declare const isBrowser: boolean;
export declare const isNavigator: boolean;

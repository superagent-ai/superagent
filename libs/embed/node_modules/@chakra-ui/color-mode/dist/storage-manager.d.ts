import { ColorMode } from './color-mode-types.js';

declare const STORAGE_KEY = "chakra-ui-color-mode";
type MaybeColorMode = ColorMode | undefined;
interface StorageManager {
    type: "cookie" | "localStorage";
    ssr?: boolean;
    get(init?: ColorMode): MaybeColorMode;
    set(value: ColorMode | "system"): void;
}
declare function createLocalStorageManager(key: string): StorageManager;
declare const localStorageManager: StorageManager;
declare function createCookieStorageManager(key: string, cookie?: string): StorageManager;
declare const cookieStorageManager: StorageManager;
declare const cookieStorageManagerSSR: (cookie: string) => StorageManager;

export { STORAGE_KEY, StorageManager, cookieStorageManager, cookieStorageManagerSSR, createCookieStorageManager, createLocalStorageManager, localStorageManager };

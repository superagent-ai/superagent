export interface StableActions<T extends object> {
    set: <K extends keyof T>(key: K, value: T[K]) => void;
    setAll: (newMap: T) => void;
    remove: <K extends keyof T>(key: K) => void;
    reset: () => void;
}
export interface Actions<T extends object> extends StableActions<T> {
    get: <K extends keyof T>(key: K) => T[K];
}
declare const useMap: <T extends object = any>(initialMap?: T) => [T, Actions<T>];
export default useMap;

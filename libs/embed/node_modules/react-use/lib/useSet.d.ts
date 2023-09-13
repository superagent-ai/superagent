export interface StableActions<K> {
    add: (key: K) => void;
    remove: (key: K) => void;
    toggle: (key: K) => void;
    reset: () => void;
}
export interface Actions<K> extends StableActions<K> {
    has: (key: K) => boolean;
}
declare const useSet: <K>(initialSet?: Set<K>) => [Set<K>, Actions<K>];
export default useSet;

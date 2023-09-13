export interface UseStateListReturn<T> {
    state: T;
    currentIndex: number;
    setStateAt: (newIndex: number) => void;
    setState: (state: T) => void;
    next: () => void;
    prev: () => void;
}
export default function useStateList<T>(stateSet?: T[]): UseStateListReturn<T>;

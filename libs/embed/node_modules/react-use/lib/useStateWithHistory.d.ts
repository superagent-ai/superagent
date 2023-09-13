import { Dispatch } from 'react';
import { IHookStateInitAction, IHookStateSetAction } from './misc/hookState';
interface HistoryState<S> {
    history: S[];
    position: number;
    capacity: number;
    back: (amount?: number) => void;
    forward: (amount?: number) => void;
    go: (position: number) => void;
}
export declare type UseStateHistoryReturn<S> = [S, Dispatch<IHookStateSetAction<S>>, HistoryState<S>];
export declare function useStateWithHistory<S, I extends S>(initialState: IHookStateInitAction<S>, capacity?: number, initialHistory?: I[]): UseStateHistoryReturn<S>;
export declare function useStateWithHistory<S = undefined>(): UseStateHistoryReturn<S | undefined>;
export {};

import { Dispatch, SetStateAction } from 'react';
export interface StateMediator<S = any> {
    (newState: any): S;
    (newState: any, dispatch: Dispatch<SetStateAction<S>>): void;
}
export declare type UseMediatedStateReturn<S = any> = [S, Dispatch<SetStateAction<S>>];
export declare function useMediatedState<S = undefined>(mediator: StateMediator<S | undefined>): UseMediatedStateReturn<S | undefined>;
export declare function useMediatedState<S = any>(mediator: StateMediator<S>, initialState: S): UseMediatedStateReturn<S>;

import { IHookStateInitAction, IHookStateSetAction } from '../misc/hookState';
export declare function createGlobalState<S = any>(initialState: IHookStateInitAction<S>): () => [S, (state: IHookStateSetAction<S>) => void];
export declare function createGlobalState<S = undefined>(): () => [
    S,
    (state: IHookStateSetAction<S>) => void
];
export default createGlobalState;

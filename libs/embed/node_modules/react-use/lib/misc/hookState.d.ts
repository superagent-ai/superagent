export declare type IHookStateInitialSetter<S> = () => S;
export declare type IHookStateInitAction<S> = S | IHookStateInitialSetter<S>;
export declare type IHookStateSetter<S> = ((prevState: S) => S) | (() => S);
export declare type IHookStateSetAction<S> = S | IHookStateSetter<S>;
export declare type IHookStateResolvable<S> = S | IHookStateInitialSetter<S> | IHookStateSetter<S>;
export declare function resolveHookState<S>(nextState: IHookStateInitAction<S>): S;
export declare function resolveHookState<S, C extends S>(nextState: IHookStateSetAction<S>, currentState?: C): S;
export declare function resolveHookState<S, C extends S>(nextState: IHookStateResolvable<S>, currentState?: C): S;

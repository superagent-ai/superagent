declare type CreateMethods<M, T> = (state: T) => {
    [P in keyof M]: (payload?: any) => T;
};
declare type WrappedMethods<M> = {
    [P in keyof M]: (...payload: any) => void;
};
declare const useMethods: <M, T>(createMethods: CreateMethods<M, T>, initialState: T) => [T, WrappedMethods<M>];
export default useMethods;

declare type Dispatch<Action> = (action: Action) => void;
interface Store<Action, State> {
    getState: () => State;
    dispatch: Dispatch<Action>;
}
declare type Middleware<Action, State> = (store: Store<Action, State>) => (next: Dispatch<Action>) => (action: Action) => void;
declare const createReducer: <Action, State>(...middlewares: Middleware<Action, State>[]) => (reducer: (state: State, action: Action) => State, initialState: State, initializer?: (value: State) => State) => [State, Dispatch<Action>];
export default createReducer;

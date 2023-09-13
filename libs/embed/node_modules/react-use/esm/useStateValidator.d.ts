import { Dispatch, SetStateAction } from 'react';
export declare type ValidityState = [boolean | undefined, ...any[]] | [undefined];
export interface StateValidator<V, S> {
    (state: S): V;
    (state: S, dispatch: Dispatch<SetStateAction<V>>): void;
}
export declare type UseStateValidatorReturn<V> = [V, () => void];
export default function useStateValidator<V extends ValidityState, S>(state: S, validator: StateValidator<V, S>, initialState?: V): UseStateValidatorReturn<V>;

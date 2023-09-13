import { StateValidator, UseStateValidatorReturn, ValidityState } from './useStateValidator';
export declare type MultiStateValidatorStates = any[] | {
    [p: string]: any;
} | {
    [p: number]: any;
};
export declare type MultiStateValidator<V extends ValidityState, S extends MultiStateValidatorStates> = StateValidator<V, S>;
export declare function useMultiStateValidator<V extends ValidityState, S extends MultiStateValidatorStates>(states: S, validator: MultiStateValidator<V, S>, initialValidity?: V): UseStateValidatorReturn<V>;

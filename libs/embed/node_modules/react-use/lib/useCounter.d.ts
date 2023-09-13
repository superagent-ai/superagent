import { IHookStateInitAction, IHookStateSetAction } from './misc/hookState';
export interface CounterActions {
    inc: (delta?: number) => void;
    dec: (delta?: number) => void;
    get: () => number;
    set: (value: IHookStateSetAction<number>) => void;
    reset: (value?: IHookStateSetAction<number>) => void;
}
export default function useCounter(initialValue?: IHookStateInitAction<number>, max?: number | null, min?: number | null): [number, CounterActions];

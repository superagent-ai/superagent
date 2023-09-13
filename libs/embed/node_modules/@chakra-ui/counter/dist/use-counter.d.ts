import * as react from 'react';

interface UseCounterProps {
    /**
     * The callback fired when the value changes
     */
    onChange?(valueAsString: string, valueAsNumber: number): void;
    /**
     * The number of decimal points used to round the value
     */
    precision?: number;
    /**
     * The initial value of the counter. Should be less than `max` and greater than `min`
     */
    defaultValue?: string | number;
    /**
     * The value of the counter. Should be less than `max` and greater than `min`
     */
    value?: string | number;
    /**
     * The step used to increment or decrement the value
     * @default 1
     */
    step?: number;
    /**
     * The minimum value of the counter
     * @default Number.MIN_SAFE_INTEGER
     */
    min?: number;
    /**
     * The maximum value of the counter
     * @default Number.MAX_SAFE_INTEGER
     */
    max?: number;
    /**
     * This controls the value update behavior in general.
     *
     * - If `true` and you use the stepper or up/down arrow keys,
     *  the value will not exceed the `max` or go lower than `min`
     *
     * - If `false`, the value will be allowed to go out of range.
     *
     * @default true
     */
    keepWithinRange?: boolean;
}
declare function useCounter(props?: UseCounterProps): {
    isOutOfRange: boolean;
    isAtMax: boolean;
    isAtMin: boolean;
    precision: number;
    value: string | number;
    valueAsNumber: number;
    update: (next: string | number) => void;
    reset: () => void;
    increment: (step?: number) => void;
    decrement: (step?: number) => void;
    clamp: (value: number) => string;
    cast: (value: string | number) => void;
    setValue: react.Dispatch<react.SetStateAction<string | number>>;
};
type UseCounterReturn = ReturnType<typeof useCounter>;

export { UseCounterProps, UseCounterReturn, useCounter };

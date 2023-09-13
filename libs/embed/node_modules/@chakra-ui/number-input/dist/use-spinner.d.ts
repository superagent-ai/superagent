/**
 * React hook used in the number input to spin its
 * value on long press of the spin buttons
 *
 * @param increment the function to increment
 * @param decrement the function to decrement
 */
declare function useSpinner(increment: Function, decrement: Function): {
    up: () => void;
    down: () => void;
    stop: () => void;
    isSpinning: boolean;
};

export { useSpinner };

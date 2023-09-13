/**
 * React hook that provides a declarative `setTimeout`
 *
 * @param callback the callback to run after specified delay
 * @param delay the delay (in ms)
 */
declare function useTimeout(callback: (...args: any[]) => void, delay: number | null): void;

export { useTimeout };

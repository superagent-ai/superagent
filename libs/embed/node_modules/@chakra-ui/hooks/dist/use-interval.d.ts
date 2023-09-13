/**
 * React Hook that provides a declarative `setInterval`
 *
 * @param callback the callback to execute at interval
 * @param delay the `setInterval` delay (in ms)
 */
declare function useInterval(callback: () => void, delay: number | null): void;

export { useInterval };

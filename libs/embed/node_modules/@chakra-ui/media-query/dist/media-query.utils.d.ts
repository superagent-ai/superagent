declare function getClosestValue<T = any>(values: Record<string, T>, breakpoint: string, breakpoints?: readonly string[]): T | undefined;

export { getClosestValue };

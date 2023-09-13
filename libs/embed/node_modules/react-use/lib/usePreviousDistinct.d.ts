export declare type Predicate<T> = (prev: T | undefined, next: T) => boolean;
export default function usePreviousDistinct<T>(value: T, compare?: Predicate<T>): T | undefined;

/**
 * Used to define the anatomy/parts of a component in a way that provides
 * a consistent API for `className`, css selector and `theming`.
 */
declare function anatomy<T extends string = string>(name: string, map?: Record<T, Part>): Anatomy<T>;
type Part = {
    className: string;
    selector: string;
    toString: () => string;
};
type Anatomy<T extends string> = {
    parts: <V extends string>(...values: V[]) => Omit<Anatomy<V>, "parts">;
    toPart: (part: string) => Part;
    extend: <U extends string>(...parts: U[]) => Omit<Anatomy<T | U>, "parts">;
    selectors: () => Record<T, string>;
    classnames: () => Record<T, string>;
    keys: T[];
    __type: T;
};

export { anatomy };

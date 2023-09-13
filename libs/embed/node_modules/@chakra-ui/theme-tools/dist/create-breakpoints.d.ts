interface BaseBreakpointConfig {
    sm: string;
    md: string;
    lg: string;
    xl: string;
    "2xl"?: string;
    [key: string]: string | undefined;
}
type Breakpoints<T> = T & {
    base: "0em";
};
/**
 * @deprecated will be deprecated pretty soon, simply pass the breakpoints as an object
 */
declare const createBreakpoints: <T extends BaseBreakpointConfig>(config: T) => Breakpoints<T>;

export { BaseBreakpointConfig, Breakpoints, createBreakpoints };

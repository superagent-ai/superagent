declare const createBreakpoint: (breakpoints?: {
    [name: string]: number;
}) => () => string;
export default createBreakpoint;

import { Dict } from './types.js';

declare function px(value: number | string | null): string | null;
declare function toMediaQueryString(min: string | null, max?: string): string;
declare function analyzeBreakpoints(breakpoints: Dict): {
    keys: Set<string>;
    normalized: string[];
    isResponsive(test: Dict): boolean;
    asObject: Dict<any>;
    asArray: string[];
    details: {
        _minW: string;
        breakpoint: string;
        minW: any;
        maxW: any;
        maxWQuery: string;
        minWQuery: string;
        minMaxQuery: string;
    }[];
    media: (string | null)[];
    /**
     * Converts the object responsive syntax to array syntax
     *
     * @example
     * toArrayValue({ base: 1, sm: 2, md: 3 }) // => [1, 2, 3]
     */
    toArrayValue(test: Dict): any[];
    /**
     * Converts the array responsive syntax to object syntax
     *
     * @example
     * toObjectValue([1, 2, 3]) // => { base: 1, sm: 2, md: 3 }
     */
    toObjectValue(test: any[]): any;
} | null;
declare type AnalyzeBreakpointsReturn = ReturnType<typeof analyzeBreakpoints>;

export { AnalyzeBreakpointsReturn, analyzeBreakpoints, px, toMediaQueryString };

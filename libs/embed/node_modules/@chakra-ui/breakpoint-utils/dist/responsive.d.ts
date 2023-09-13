declare const breakpoints: readonly string[];
declare function mapResponsive(prop: any, mapper: (val: any) => any): any;
declare function objectToArrayNotation(obj: Record<string, any>, bps?: readonly string[]): any[];
declare function arrayToObjectNotation(values: any[], bps?: readonly string[]): Record<string, any>;
declare function isResponsiveObjectLike(obj: Record<string, any>, bps?: readonly string[]): boolean;
/**
 * since breakpoints are defined as custom properties on an array, you may
 * `Object.keys(theme.breakpoints)` to retrieve both regular numeric indices
 * and custom breakpoints as string.
 *
 * This function returns true given a custom array property.
 */
declare const isCustomBreakpoint: (v: string) => boolean;

export { arrayToObjectNotation, breakpoints, isCustomBreakpoint, isResponsiveObjectLike, mapResponsive, objectToArrayNotation };

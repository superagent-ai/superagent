declare function isDecimal(value: any): boolean;
declare function addPrefix(value: string, prefix?: string): string;
declare function toVarRef(name: string, fallback?: string): string;
declare function toVar(value: string, prefix?: string): string;
type CSSVar = {
    variable: string;
    reference: string;
};
type CSSVarOptions = {
    fallback?: string | CSSVar;
    prefix?: string;
};
declare function cssVar(name: string, options?: CSSVarOptions): {
    variable: string;
    reference: string;
};

export { CSSVar, CSSVarOptions, addPrefix, cssVar, isDecimal, toVar, toVarRef };

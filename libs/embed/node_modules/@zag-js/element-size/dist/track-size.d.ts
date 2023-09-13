export type ElementSize = {
    width: number;
    height: number;
};
export type ElementSizeCallback = (size: ElementSize | undefined) => void;
export declare function trackElementSize(element: HTMLElement | null, callback: ElementSizeCallback): (() => void) | undefined;

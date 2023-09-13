interface Options {
    isPreventDefault?: boolean;
    delay?: number;
}
declare const useLongPress: (callback: (e: TouchEvent | MouseEvent) => void, { isPreventDefault, delay }?: Options) => {
    readonly onMouseDown: (e: any) => void;
    readonly onTouchStart: (e: any) => void;
    readonly onMouseUp: () => void;
    readonly onMouseLeave: () => void;
    readonly onTouchEnd: () => void;
};
export default useLongPress;

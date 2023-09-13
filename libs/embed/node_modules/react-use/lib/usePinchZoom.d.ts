import { RefObject } from 'react';
export declare type CacheRef = {
    prevDiff: number;
    evCache: Array<PointerEvent>;
};
export declare enum ZoomState {
    'ZOOMING_IN' = "ZOOMING_IN",
    'ZOOMING_OUT' = "ZOOMING_OUT"
}
export declare type ZoomStateType = ZoomState.ZOOMING_IN | ZoomState.ZOOMING_OUT;
declare const usePinchZoom: (ref: RefObject<HTMLElement>) => {
    zoomingState: ZoomState;
    pinchState: number;
} | {
    zoomingState: null;
    pinchState: number;
};
export default usePinchZoom;

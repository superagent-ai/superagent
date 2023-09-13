import { Point, AnyPointerEvent } from './pointer-event.js';

/**
 * This is a modified version of `PanSession` from `framer-motion`.
 *
 * Credit goes to `framer-motion` of this useful utilities.
 * License can be found here: https://github.com/framer/motion
 */

/**
 * The event information passed to pan event handlers like `onPan`, `onPanStart`.
 *
 * It contains information about the current state of the tap gesture such as its
 * `point`, `delta`, and `offset`
 */
interface PanEventInfo {
    /**
     * Contains `x` and `y` values for the current pan position relative
     * to the device or page.
     */
    point: Point;
    /**
     * Contains `x` and `y` values for the distance moved since
     * the last pan event.
     */
    delta: Point;
    /**
     * Contains `x` and `y` values for the distance moved from
     * the first pan event.
     */
    offset: Point;
    /**
     * Contains `x` and `y` values for the current velocity of the pointer.
     */
    velocity: Point;
}
declare type PanEventHandler = (event: AnyPointerEvent, info: PanEventInfo) => void;
interface PanSessionHandlers {
    /**
     * Callback fired when the pan session is created.
     * This is typically called once `pointerdown` event is fired.
     */
    onSessionStart: PanEventHandler;
    /**
     * Callback fired when the pan session is detached.
     * This is typically called once `pointerup` event is fired.
     */
    onSessionEnd: PanEventHandler;
    /**
     * Callback fired when the pan session has started.
     * The pan session when the pan offset is greater than
     * the threshold (allowable move distance to detect pan)
     */
    onStart: PanEventHandler;
    /**
     * Callback fired while panning
     */
    onMove: PanEventHandler;
    /**
     * Callback fired when the current pan session has ended.
     * This is typically called once `pointerup` event is fired.
     */
    onEnd: PanEventHandler;
}
declare type PanSessionOptions = {
    threshold?: number;
    window?: Window;
};
/**
 * @internal
 *
 * A Pan Session is recognized when the pointer is down
 * and moved in the allowed direction.
 */
declare class PanSession {
    /**
     * We use this to keep track of the `x` and `y` pan session history
     * as the pan event happens. It helps to calculate the `offset` and `delta`
     */
    private history;
    private startEvent;
    private lastEvent;
    private lastEventInfo;
    private handlers;
    private removeListeners;
    /**
     * Minimal pan distance required before recognizing the pan.
     * @default "3px"
     */
    private threshold;
    private win;
    constructor(event: AnyPointerEvent, handlers: Partial<PanSessionHandlers>, threshold?: number);
    private updatePoint;
    private onPointerMove;
    private onPointerUp;
    updateHandlers(handlers: Partial<PanSessionHandlers>): void;
    end(): void;
}

export { PanEventHandler, PanEventInfo, PanSession, PanSessionHandlers, PanSessionOptions };

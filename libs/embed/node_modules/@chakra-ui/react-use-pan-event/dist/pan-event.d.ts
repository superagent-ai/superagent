import { AnyPointerEvent, PanEventHandlers, Point } from './types.js';

/**
 * A Pan Session is recognized when the pointer is down
 * and moved in the allowed direction.
 */
declare class PanEvent {
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
    constructor(event: AnyPointerEvent, handlers: Partial<PanEventHandlers>, threshold?: number);
    private updatePoint;
    private onPointerMove;
    private onPointerUp;
    updateHandlers(handlers: Partial<PanEventHandlers>): void;
    end(): void;
}
declare function distance<P extends Point | number>(a: P, b: P): number;

export { PanEvent, distance };

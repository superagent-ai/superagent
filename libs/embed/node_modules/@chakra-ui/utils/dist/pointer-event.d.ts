/**
 * Credit goes to `framer-motion` of this useful utilities.
 * License can be found here: https://github.com/framer/motion
 */
declare type AnyPointerEvent = MouseEvent | TouchEvent | PointerEvent;
declare type PointType = "page" | "client";
declare function isMouseEvent(event: AnyPointerEvent): event is MouseEvent;
declare function isTouchEvent(event: AnyPointerEvent): event is TouchEvent;
interface Point {
    x: number;
    y: number;
}
interface PointerEventInfo {
    point: Point;
}
declare type EventHandler = (event: AnyPointerEvent, info: PointerEventInfo) => void;
declare type EventListenerWithPointInfo = (e: AnyPointerEvent, info: PointerEventInfo) => void;
declare function extractEventInfo(event: AnyPointerEvent, pointType?: PointType): PointerEventInfo;
declare function getViewportPointFromEvent(event: AnyPointerEvent): PointerEventInfo;
declare const wrapPointerEventHandler: (handler: EventListenerWithPointInfo, shouldFilterPrimaryPointer?: boolean) => EventListener;
declare function getPointerEventName(name: string): string;
declare function addPointerEvent(target: EventTarget, eventName: string, handler: EventListenerWithPointInfo, options?: AddEventListenerOptions): () => void;
declare function isMultiTouchEvent(event: AnyPointerEvent): boolean;

export { AnyPointerEvent, EventHandler, EventListenerWithPointInfo, Point, PointerEventInfo, addPointerEvent, extractEventInfo, getPointerEventName, getViewportPointFromEvent, isMouseEvent, isMultiTouchEvent, isTouchEvent, wrapPointerEventHandler };

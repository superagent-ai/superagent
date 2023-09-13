declare type AnyPointerEvent = MouseEvent | TouchEvent | PointerEvent;
interface Point {
    x: number;
    y: number;
}
interface PointerEventInfo {
    point: Point;
}
interface MixedEventListener {
    (e: AnyPointerEvent, info: PointerEventInfo): void;
}
declare type PointType = "page" | "client";

export { AnyPointerEvent, MixedEventListener, Point, PointType, PointerEventInfo };

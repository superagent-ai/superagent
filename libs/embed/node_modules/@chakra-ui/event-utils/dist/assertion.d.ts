import { AnyPointerEvent } from './types.js';

declare function isMouseEvent(event: any): event is MouseEvent;
declare function isTouchEvent(event: AnyPointerEvent): event is TouchEvent;
declare function isMultiTouchEvent(event: AnyPointerEvent): boolean;
declare function getEventWindow(event: Event): typeof globalThis;

export { getEventWindow, isMouseEvent, isMultiTouchEvent, isTouchEvent };

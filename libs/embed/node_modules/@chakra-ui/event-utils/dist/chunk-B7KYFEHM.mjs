// src/assertion.ts
function isMouseEvent(event) {
  const win = getEventWindow(event);
  if (typeof win.PointerEvent !== "undefined" && event instanceof win.PointerEvent) {
    return !!(event.pointerType === "mouse");
  }
  return event instanceof win.MouseEvent;
}
function isTouchEvent(event) {
  const hasTouches = !!event.touches;
  return hasTouches;
}
function isMultiTouchEvent(event) {
  return isTouchEvent(event) && event.touches.length > 1;
}
function getEventWindow(event) {
  var _a;
  return (_a = event.view) != null ? _a : window;
}

export {
  isMouseEvent,
  isTouchEvent,
  isMultiTouchEvent,
  getEventWindow
};

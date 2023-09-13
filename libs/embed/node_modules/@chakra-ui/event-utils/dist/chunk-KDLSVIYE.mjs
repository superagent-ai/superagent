import {
  addDomEvent
} from "./chunk-6K7SS4J6.mjs";
import {
  getEventPoint
} from "./chunk-6FBKF3LK.mjs";
import {
  isMouseEvent
} from "./chunk-B7KYFEHM.mjs";

// src/add-pointer-event.ts
function filter(cb) {
  return (event) => {
    const isMouse = isMouseEvent(event);
    if (!isMouse || isMouse && event.button === 0) {
      cb(event);
    }
  };
}
function wrap(cb, filterPrimary = false) {
  function listener(event) {
    cb(event, { point: getEventPoint(event) });
  }
  const fn = filterPrimary ? filter(listener) : listener;
  return fn;
}
function addPointerEvent(target, type, cb, options) {
  return addDomEvent(target, type, wrap(cb, type === "pointerdown"), options);
}

export {
  addPointerEvent
};

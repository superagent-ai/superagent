'use client'
"use strict";
var __create = Object.create;
var __defProp = Object.defineProperty;
var __getOwnPropDesc = Object.getOwnPropertyDescriptor;
var __getOwnPropNames = Object.getOwnPropertyNames;
var __getProtoOf = Object.getPrototypeOf;
var __hasOwnProp = Object.prototype.hasOwnProperty;
var __defNormalProp = (obj, key, value) => key in obj ? __defProp(obj, key, { enumerable: true, configurable: true, writable: true, value }) : obj[key] = value;
var __export = (target, all) => {
  for (var name in all)
    __defProp(target, name, { get: all[name], enumerable: true });
};
var __copyProps = (to, from, except, desc) => {
  if (from && typeof from === "object" || typeof from === "function") {
    for (let key of __getOwnPropNames(from))
      if (!__hasOwnProp.call(to, key) && key !== except)
        __defProp(to, key, { get: () => from[key], enumerable: !(desc = __getOwnPropDesc(from, key)) || desc.enumerable });
  }
  return to;
};
var __toESM = (mod, isNodeMode, target) => (target = mod != null ? __create(__getProtoOf(mod)) : {}, __copyProps(
  // If the importer is in node compatibility mode or this is not an ESM
  // file that has been converted to a CommonJS file using a Babel-
  // compatible transform (i.e. "__esModule" has not been set), then set
  // "default" to the CommonJS "module.exports" for node compatibility.
  isNodeMode || !mod || !mod.__esModule ? __defProp(target, "default", { value: mod, enumerable: true }) : target,
  mod
));
var __toCommonJS = (mod) => __copyProps(__defProp({}, "__esModule", { value: true }), mod);
var __publicField = (obj, key, value) => {
  __defNormalProp(obj, typeof key !== "symbol" ? key + "" : key, value);
  return value;
};

// src/use-pan-event.ts
var use_pan_event_exports = {};
__export(use_pan_event_exports, {
  usePanEvent: () => usePanEvent
});
module.exports = __toCommonJS(use_pan_event_exports);
var import_event_utils2 = require("@chakra-ui/event-utils");
var import_react_use_latest_ref = require("@chakra-ui/react-use-latest-ref");
var import_react = require("react");

// src/pan-event.ts
var import_event_utils = require("@chakra-ui/event-utils");
var import_framesync = __toESM(require("framesync"));
var PanEvent = class {
  constructor(event, handlers, threshold) {
    /**
     * We use this to keep track of the `x` and `y` pan session history
     * as the pan event happens. It helps to calculate the `offset` and `delta`
     */
    __publicField(this, "history", []);
    // The pointer event that started the pan session
    __publicField(this, "startEvent", null);
    // The current pointer event for the pan session
    __publicField(this, "lastEvent", null);
    // The current pointer event info for the pan session
    __publicField(this, "lastEventInfo", null);
    __publicField(this, "handlers", {});
    __publicField(this, "removeListeners", () => {
    });
    /**
     * Minimal pan distance required before recognizing the pan.
     * @default "3px"
     */
    __publicField(this, "threshold", 3);
    __publicField(this, "win");
    __publicField(this, "updatePoint", () => {
      if (!(this.lastEvent && this.lastEventInfo))
        return;
      const info = getPanInfo(this.lastEventInfo, this.history);
      const isPanStarted = this.startEvent !== null;
      const isDistancePastThreshold = distance(info.offset, { x: 0, y: 0 }) >= this.threshold;
      if (!isPanStarted && !isDistancePastThreshold)
        return;
      const { timestamp } = (0, import_framesync.getFrameData)();
      this.history.push({ ...info.point, timestamp });
      const { onStart, onMove } = this.handlers;
      if (!isPanStarted) {
        onStart == null ? void 0 : onStart(this.lastEvent, info);
        this.startEvent = this.lastEvent;
      }
      onMove == null ? void 0 : onMove(this.lastEvent, info);
    });
    __publicField(this, "onPointerMove", (event, info) => {
      this.lastEvent = event;
      this.lastEventInfo = info;
      import_framesync.default.update(this.updatePoint, true);
    });
    __publicField(this, "onPointerUp", (event, info) => {
      const panInfo = getPanInfo(info, this.history);
      const { onEnd, onSessionEnd } = this.handlers;
      onSessionEnd == null ? void 0 : onSessionEnd(event, panInfo);
      this.end();
      if (!onEnd || !this.startEvent)
        return;
      onEnd == null ? void 0 : onEnd(event, panInfo);
    });
    var _a;
    this.win = (_a = event.view) != null ? _a : window;
    if ((0, import_event_utils.isMultiTouchEvent)(event))
      return;
    this.handlers = handlers;
    if (threshold) {
      this.threshold = threshold;
    }
    event.stopPropagation();
    event.preventDefault();
    const info = { point: (0, import_event_utils.getEventPoint)(event) };
    const { timestamp } = (0, import_framesync.getFrameData)();
    this.history = [{ ...info.point, timestamp }];
    const { onSessionStart } = handlers;
    onSessionStart == null ? void 0 : onSessionStart(event, getPanInfo(info, this.history));
    this.removeListeners = pipe(
      (0, import_event_utils.addPointerEvent)(this.win, "pointermove", this.onPointerMove),
      (0, import_event_utils.addPointerEvent)(this.win, "pointerup", this.onPointerUp),
      (0, import_event_utils.addPointerEvent)(this.win, "pointercancel", this.onPointerUp)
    );
  }
  updateHandlers(handlers) {
    this.handlers = handlers;
  }
  end() {
    var _a;
    (_a = this.removeListeners) == null ? void 0 : _a.call(this);
    import_framesync.cancelSync.update(this.updatePoint);
  }
};
function subtract(a, b) {
  return { x: a.x - b.x, y: a.y - b.y };
}
function getPanInfo(info, history) {
  return {
    point: info.point,
    delta: subtract(info.point, history[history.length - 1]),
    offset: subtract(info.point, history[0]),
    velocity: getVelocity(history, 0.1)
  };
}
var toMilliseconds = (v) => v * 1e3;
function getVelocity(history, timeDelta) {
  if (history.length < 2) {
    return { x: 0, y: 0 };
  }
  let i = history.length - 1;
  let timestampedPoint = null;
  const lastPoint = history[history.length - 1];
  while (i >= 0) {
    timestampedPoint = history[i];
    if (lastPoint.timestamp - timestampedPoint.timestamp > toMilliseconds(timeDelta)) {
      break;
    }
    i--;
  }
  if (!timestampedPoint) {
    return { x: 0, y: 0 };
  }
  const time = (lastPoint.timestamp - timestampedPoint.timestamp) / 1e3;
  if (time === 0) {
    return { x: 0, y: 0 };
  }
  const currentVelocity = {
    x: (lastPoint.x - timestampedPoint.x) / time,
    y: (lastPoint.y - timestampedPoint.y) / time
  };
  if (currentVelocity.x === Infinity) {
    currentVelocity.x = 0;
  }
  if (currentVelocity.y === Infinity) {
    currentVelocity.y = 0;
  }
  return currentVelocity;
}
function pipe(...fns) {
  return (v) => fns.reduce((a, b) => b(a), v);
}
function distance1D(a, b) {
  return Math.abs(a - b);
}
function isPoint(point) {
  return "x" in point && "y" in point;
}
function distance(a, b) {
  if (typeof a === "number" && typeof b === "number") {
    return distance1D(a, b);
  }
  if (isPoint(a) && isPoint(b)) {
    const xDelta = distance1D(a.x, b.x);
    const yDelta = distance1D(a.y, b.y);
    return Math.sqrt(xDelta ** 2 + yDelta ** 2);
  }
  return 0;
}

// src/use-pan-event.ts
function usePanEvent(ref, options) {
  const {
    onPan,
    onPanStart,
    onPanEnd,
    onPanSessionStart,
    onPanSessionEnd,
    threshold
  } = options;
  const hasPanEvents = Boolean(
    onPan || onPanStart || onPanEnd || onPanSessionStart || onPanSessionEnd
  );
  const panSession = (0, import_react.useRef)(null);
  const handlersRef = (0, import_react_use_latest_ref.useLatestRef)({
    onSessionStart: onPanSessionStart,
    onSessionEnd: onPanSessionEnd,
    onStart: onPanStart,
    onMove: onPan,
    onEnd(event, info) {
      panSession.current = null;
      onPanEnd == null ? void 0 : onPanEnd(event, info);
    }
  });
  (0, import_react.useEffect)(() => {
    var _a;
    (_a = panSession.current) == null ? void 0 : _a.updateHandlers(handlersRef.current);
  });
  (0, import_react.useEffect)(() => {
    const node = ref.current;
    if (!node || !hasPanEvents)
      return;
    function onPointerDown(event) {
      panSession.current = new PanEvent(event, handlersRef.current, threshold);
    }
    return (0, import_event_utils2.addPointerEvent)(node, "pointerdown", onPointerDown);
  }, [ref, hasPanEvents, handlersRef, threshold]);
  (0, import_react.useEffect)(() => {
    return () => {
      var _a;
      (_a = panSession.current) == null ? void 0 : _a.end();
      panSession.current = null;
    };
  }, []);
}
// Annotate the CommonJS export names for ESM import in node:
0 && (module.exports = {
  usePanEvent
});
//# sourceMappingURL=use-pan-event.js.map
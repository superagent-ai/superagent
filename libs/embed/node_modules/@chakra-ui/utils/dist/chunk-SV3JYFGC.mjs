import {
  addPointerEvent,
  extractEventInfo,
  isMouseEvent,
  isMultiTouchEvent
} from "./chunk-LCE7F24A.mjs";
import {
  getEventWindow
} from "./chunk-O3SWHQEE.mjs";
import {
  distance,
  noop,
  pipe
} from "./chunk-M3TFMUOL.mjs";
import {
  __publicField
} from "./chunk-NHABU752.mjs";

// src/pan-event.ts
import sync, { cancelSync, getFrameData } from "framesync";
var PanSession = class {
  constructor(event, handlers, threshold) {
    __publicField(this, "history", []);
    __publicField(this, "startEvent", null);
    __publicField(this, "lastEvent", null);
    __publicField(this, "lastEventInfo", null);
    __publicField(this, "handlers", {});
    __publicField(this, "removeListeners", noop);
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
      const { timestamp } = getFrameData();
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
      if (isMouseEvent(event) && event.buttons === 0) {
        this.onPointerUp(event, info);
        return;
      }
      sync.update(this.updatePoint, true);
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
    this.win = getEventWindow(event);
    if (isMultiTouchEvent(event))
      return;
    this.handlers = handlers;
    if (threshold) {
      this.threshold = threshold;
    }
    event.stopPropagation();
    event.preventDefault();
    const info = extractEventInfo(event);
    const { timestamp } = getFrameData();
    this.history = [{ ...info.point, timestamp }];
    const { onSessionStart } = handlers;
    onSessionStart == null ? void 0 : onSessionStart(event, getPanInfo(info, this.history));
    this.removeListeners = pipe(
      addPointerEvent(this.win, "pointermove", this.onPointerMove),
      addPointerEvent(this.win, "pointerup", this.onPointerUp),
      addPointerEvent(this.win, "pointercancel", this.onPointerUp)
    );
  }
  updateHandlers(handlers) {
    this.handlers = handlers;
  }
  end() {
    var _a;
    (_a = this.removeListeners) == null ? void 0 : _a.call(this);
    cancelSync.update(this.updatePoint);
  }
};
function subtractPoint(a, b) {
  return { x: a.x - b.x, y: a.y - b.y };
}
function startPanPoint(history) {
  return history[0];
}
function lastPanPoint(history) {
  return history[history.length - 1];
}
function getPanInfo(info, history) {
  return {
    point: info.point,
    delta: subtractPoint(info.point, lastPanPoint(history)),
    offset: subtractPoint(info.point, startPanPoint(history)),
    velocity: getVelocity(history, 0.1)
  };
}
function lastDevicePoint(history) {
  return history[history.length - 1];
}
var toMilliseconds = (seconds) => seconds * 1e3;
function getVelocity(history, timeDelta) {
  if (history.length < 2) {
    return { x: 0, y: 0 };
  }
  let i = history.length - 1;
  let timestampedPoint = null;
  const lastPoint = lastDevicePoint(history);
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

export {
  PanSession
};

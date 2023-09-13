'use client'

// src/popper.placement.ts
var logicals = {
  "start-start": { ltr: "left-start", rtl: "right-start" },
  "start-end": { ltr: "left-end", rtl: "right-end" },
  "end-start": { ltr: "right-start", rtl: "left-start" },
  "end-end": { ltr: "right-end", rtl: "left-end" },
  start: { ltr: "left", rtl: "right" },
  end: { ltr: "right", rtl: "left" }
};
var opposites = {
  "auto-start": "auto-end",
  "auto-end": "auto-start",
  "top-start": "top-end",
  "top-end": "top-start",
  "bottom-start": "bottom-end",
  "bottom-end": "bottom-start"
};
function getPopperPlacement(placement, dir = "ltr") {
  var _a, _b;
  const value = ((_a = logicals[placement]) == null ? void 0 : _a[dir]) || placement;
  if (dir === "ltr")
    return value;
  return (_b = opposites[placement]) != null ? _b : value;
}

export {
  getPopperPlacement
};
//# sourceMappingURL=chunk-AUJXXV3B.mjs.map
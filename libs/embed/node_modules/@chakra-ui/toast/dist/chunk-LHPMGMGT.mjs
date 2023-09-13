'use client'

// src/toast.placement.ts
function getToastPlacement(position, dir) {
  var _a;
  const computedPosition = position != null ? position : "bottom";
  const logicals = {
    "top-start": { ltr: "top-left", rtl: "top-right" },
    "top-end": { ltr: "top-right", rtl: "top-left" },
    "bottom-start": { ltr: "bottom-left", rtl: "bottom-right" },
    "bottom-end": { ltr: "bottom-right", rtl: "bottom-left" }
  };
  const logical = logicals[computedPosition];
  return (_a = logical == null ? void 0 : logical[dir]) != null ? _a : computedPosition;
}

export {
  getToastPlacement
};
//# sourceMappingURL=chunk-LHPMGMGT.mjs.map
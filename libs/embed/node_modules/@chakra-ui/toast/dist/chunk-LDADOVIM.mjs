'use client'

// src/toast.utils.ts
var findById = (arr, id) => arr.find((toast) => toast.id === id);
function findToast(toasts, id) {
  const position = getToastPosition(toasts, id);
  const index = position ? toasts[position].findIndex((toast) => toast.id === id) : -1;
  return {
    position,
    index
  };
}
function getToastPosition(toasts, id) {
  for (const [position, values] of Object.entries(toasts)) {
    if (findById(values, id)) {
      return position;
    }
  }
}
var isVisible = (toasts, id) => !!getToastPosition(toasts, id);
function getToastStyle(position) {
  const isRighty = position.includes("right");
  const isLefty = position.includes("left");
  let alignItems = "center";
  if (isRighty)
    alignItems = "flex-end";
  if (isLefty)
    alignItems = "flex-start";
  return {
    display: "flex",
    flexDirection: "column",
    alignItems
  };
}
function getToastListStyle(position) {
  const isTopOrBottom = position === "top" || position === "bottom";
  const margin = isTopOrBottom ? "0 auto" : void 0;
  const top = position.includes("top") ? "env(safe-area-inset-top, 0px)" : void 0;
  const bottom = position.includes("bottom") ? "env(safe-area-inset-bottom, 0px)" : void 0;
  const right = !position.includes("left") ? "env(safe-area-inset-right, 0px)" : void 0;
  const left = !position.includes("right") ? "env(safe-area-inset-left, 0px)" : void 0;
  return {
    position: "fixed",
    zIndex: "var(--toast-z-index, 5500)",
    pointerEvents: "none",
    display: "flex",
    flexDirection: "column",
    margin,
    top,
    bottom,
    right,
    left
  };
}

export {
  findById,
  findToast,
  getToastPosition,
  isVisible,
  getToastStyle,
  getToastListStyle
};
//# sourceMappingURL=chunk-LDADOVIM.mjs.map
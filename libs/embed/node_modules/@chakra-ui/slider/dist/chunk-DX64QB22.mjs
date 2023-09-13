'use client'

// ../../legacy/utils/src/dom.ts
var dataAttr = (condition) => condition ? "" : void 0;
var ariaAttr = (condition) => condition ? true : void 0;
var cx = (...classNames) => classNames.filter(Boolean).join(" ");

// ../../legacy/utils/src/function.ts
function callAllHandlers(...fns) {
  return function func(event) {
    fns.some((fn) => {
      fn == null ? void 0 : fn(event);
      return event == null ? void 0 : event.defaultPrevented;
    });
  };
}

export {
  dataAttr,
  ariaAttr,
  cx,
  callAllHandlers
};
//# sourceMappingURL=chunk-DX64QB22.mjs.map
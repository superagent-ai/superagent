'use client'
"use strict";
var __defProp = Object.defineProperty;
var __getOwnPropDesc = Object.getOwnPropertyDescriptor;
var __getOwnPropNames = Object.getOwnPropertyNames;
var __hasOwnProp = Object.prototype.hasOwnProperty;
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
var __toCommonJS = (mod) => __copyProps(__defProp({}, "__esModule", { value: true }), mod);

// src/index.ts
var src_exports = {};
__export(src_exports, {
  useControllableProp: () => useControllableProp,
  useControllableState: () => useControllableState
});
module.exports = __toCommonJS(src_exports);
var import_react = require("react");
var import_react_use_callback_ref = require("@chakra-ui/react-use-callback-ref");
function useControllableProp(prop, state) {
  const controlled = typeof prop !== "undefined";
  const value = controlled ? prop : state;
  return (0, import_react.useMemo)(() => [controlled, value], [controlled, value]);
}
function useControllableState(props) {
  const {
    value: valueProp,
    defaultValue,
    onChange,
    shouldUpdate = (prev, next) => prev !== next
  } = props;
  const onChangeProp = (0, import_react_use_callback_ref.useCallbackRef)(onChange);
  const shouldUpdateProp = (0, import_react_use_callback_ref.useCallbackRef)(shouldUpdate);
  const [uncontrolledState, setUncontrolledState] = (0, import_react.useState)(defaultValue);
  const controlled = valueProp !== void 0;
  const value = controlled ? valueProp : uncontrolledState;
  const setValue = (0, import_react_use_callback_ref.useCallbackRef)(
    (next) => {
      const setter = next;
      const nextValue = typeof next === "function" ? setter(value) : next;
      if (!shouldUpdateProp(value, nextValue)) {
        return;
      }
      if (!controlled) {
        setUncontrolledState(nextValue);
      }
      onChangeProp(nextValue);
    },
    [controlled, onChangeProp, value, shouldUpdateProp]
  );
  return [value, setValue];
}
// Annotate the CommonJS export names for ESM import in node:
0 && (module.exports = {
  useControllableProp,
  useControllableState
});
//# sourceMappingURL=index.js.map
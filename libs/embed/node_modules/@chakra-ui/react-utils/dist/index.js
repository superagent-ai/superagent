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
  assignRef: () => assignRef,
  createContext: () => createContext,
  getValidChildren: () => getValidChildren,
  mergeRefs: () => mergeRefs
});
module.exports = __toCommonJS(src_exports);

// src/refs.ts
var import_utils = require("@chakra-ui/utils");
function assignRef(ref, value) {
  if (ref == null)
    return;
  if ((0, import_utils.isFunction)(ref)) {
    ref(value);
    return;
  }
  try {
    ref.current = value;
  } catch (error) {
    throw new Error(`Cannot assign value '${value}' to ref '${ref}'`);
  }
}
function mergeRefs(...refs) {
  return (node) => {
    refs.forEach((ref) => assignRef(ref, node));
  };
}

// src/context.ts
var import_react = require("react");
function createContext(options = {}) {
  const {
    strict = true,
    errorMessage = "useContext: `context` is undefined. Seems you forgot to wrap component within the Provider",
    name
  } = options;
  const Context = (0, import_react.createContext)(void 0);
  Context.displayName = name;
  function useContext() {
    var _a;
    const context = (0, import_react.useContext)(Context);
    if (!context && strict) {
      const error = new Error(errorMessage);
      error.name = "ContextError";
      (_a = Error.captureStackTrace) == null ? void 0 : _a.call(Error, error, useContext);
      throw error;
    }
    return context;
  }
  return [
    Context.Provider,
    useContext,
    Context
  ];
}

// src/children.ts
var import_react2 = require("react");
function getValidChildren(children) {
  return import_react2.Children.toArray(children).filter(
    (child) => (0, import_react2.isValidElement)(child)
  );
}
// Annotate the CommonJS export names for ESM import in node:
0 && (module.exports = {
  assignRef,
  createContext,
  getValidChildren,
  mergeRefs
});

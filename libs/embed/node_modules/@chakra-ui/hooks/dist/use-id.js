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

// src/use-id.ts
var use_id_exports = {};
__export(use_id_exports, {
  useId: () => useId,
  useIds: () => useIds,
  useOptionalPart: () => useOptionalPart
});
module.exports = __toCommonJS(use_id_exports);
var import_react = require("react");
function useId(idProp, prefix) {
  const id = (0, import_react.useId)();
  return (0, import_react.useMemo)(
    () => idProp || [prefix, id].filter(Boolean).join("-"),
    [idProp, prefix, id]
  );
}
function useIds(idProp, ...prefixes) {
  const id = useId(idProp);
  return (0, import_react.useMemo)(() => {
    return prefixes.map((prefix) => `${prefix}-${id}`);
  }, [id, prefixes]);
}
function useOptionalPart(partId) {
  const [id, setId] = (0, import_react.useState)(null);
  const ref = (0, import_react.useCallback)(
    (node) => {
      setId(node ? partId : null);
    },
    [partId]
  );
  return { ref, id, isRendered: Boolean(id) };
}
// Annotate the CommonJS export names for ESM import in node:
0 && (module.exports = {
  useId,
  useIds,
  useOptionalPart
});

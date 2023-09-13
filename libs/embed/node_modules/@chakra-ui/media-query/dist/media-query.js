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

// src/media-query.tsx
var media_query_exports = {};
__export(media_query_exports, {
  useQuery: () => useQuery
});
module.exports = __toCommonJS(media_query_exports);
var import_system = require("@chakra-ui/system");
var getBreakpoint = (theme, value) => {
  var _a, _b;
  return (_b = (_a = theme == null ? void 0 : theme.breakpoints) == null ? void 0 : _a[value]) != null ? _b : value;
};
function useQuery(props) {
  const { breakpoint = "", below, above } = props;
  const theme = (0, import_system.useTheme)();
  const bpBelow = getBreakpoint(theme, below);
  const bpAbove = getBreakpoint(theme, above);
  let query = breakpoint;
  if (bpBelow) {
    query = `(max-width: ${bpBelow})`;
  } else if (bpAbove) {
    query = `(min-width: ${bpAbove})`;
  }
  return query;
}
// Annotate the CommonJS export names for ESM import in node:
0 && (module.exports = {
  useQuery
});
//# sourceMappingURL=media-query.js.map
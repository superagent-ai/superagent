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

// src/highlight.tsx
var highlight_exports = {};
__export(highlight_exports, {
  Highlight: () => Highlight,
  Mark: () => Mark,
  useHighlight: () => useHighlight
});
module.exports = __toCommonJS(highlight_exports);
var import_system2 = require("@chakra-ui/system");
var import_react = require("react");

// src/box.tsx
var import_system = require("@chakra-ui/system");
var import_jsx_runtime = require("react/jsx-runtime");
var Box = (0, import_system.chakra)("div");
Box.displayName = "Box";
var Square = (0, import_system.forwardRef)(function Square2(props, ref) {
  const { size, centerContent = true, ...rest } = props;
  const styles = centerContent ? { display: "flex", alignItems: "center", justifyContent: "center" } : {};
  return /* @__PURE__ */ (0, import_jsx_runtime.jsx)(
    Box,
    {
      ref,
      boxSize: size,
      __css: {
        ...styles,
        flexShrink: 0,
        flexGrow: 0
      },
      ...rest
    }
  );
});
Square.displayName = "Square";
var Circle = (0, import_system.forwardRef)(function Circle2(props, ref) {
  const { size, ...rest } = props;
  return /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Square, { size, ref, borderRadius: "9999px", ...rest });
});
Circle.displayName = "Circle";

// src/highlight.tsx
var import_jsx_runtime2 = require("react/jsx-runtime");
var escapeRegexp = (term) => term.replace(/[|\\{}()[\]^$+*?.-]/g, (char) => `\\${char}`);
function buildRegex(query) {
  const _query = query.filter((text) => text.length !== 0).map((text) => escapeRegexp(text.trim()));
  if (!_query.length) {
    return null;
  }
  return new RegExp(`(${_query.join("|")})`, "ig");
}
function highlightWords({ text, query }) {
  const regex = buildRegex(Array.isArray(query) ? query : [query]);
  if (!regex) {
    return [{ text, match: false }];
  }
  const result = text.split(regex).filter(Boolean);
  return result.map((str) => ({ text: str, match: regex.test(str) }));
}
function useHighlight(props) {
  const { text, query } = props;
  return (0, import_react.useMemo)(() => highlightWords({ text, query }), [text, query]);
}
var Mark = (0, import_system2.forwardRef)(function Mark2(props, ref) {
  const styles = (0, import_system2.useStyleConfig)("Mark", props);
  const ownProps = (0, import_system2.omitThemingProps)(props);
  return /* @__PURE__ */ (0, import_jsx_runtime2.jsx)(
    Box,
    {
      ref,
      ...ownProps,
      as: "mark",
      __css: { bg: "transparent", whiteSpace: "nowrap", ...styles }
    }
  );
});
function Highlight(props) {
  const { children, query, styles } = props;
  if (typeof children !== "string") {
    throw new Error("The children prop of Highlight must be a string");
  }
  const chunks = useHighlight({ query, text: children });
  return /* @__PURE__ */ (0, import_jsx_runtime2.jsx)(import_jsx_runtime2.Fragment, { children: chunks.map((chunk, index) => {
    return chunk.match ? /* @__PURE__ */ (0, import_jsx_runtime2.jsx)(Mark, { sx: styles, children: chunk.text }, index) : /* @__PURE__ */ (0, import_jsx_runtime2.jsx)(import_react.Fragment, { children: chunk.text }, index);
  }) });
}
// Annotate the CommonJS export names for ESM import in node:
0 && (module.exports = {
  Highlight,
  Mark,
  useHighlight
});
//# sourceMappingURL=highlight.js.map
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

// src/link-box.tsx
var link_box_exports = {};
__export(link_box_exports, {
  LinkBox: () => LinkBox,
  LinkOverlay: () => LinkOverlay
});
module.exports = __toCommonJS(link_box_exports);
var import_system = require("@chakra-ui/system");
var import_shared_utils = require("@chakra-ui/shared-utils");
var import_jsx_runtime = require("react/jsx-runtime");
var LinkOverlay = (0, import_system.forwardRef)(
  function LinkOverlay2(props, ref) {
    const { isExternal, target, rel, className, ...rest } = props;
    return /* @__PURE__ */ (0, import_jsx_runtime.jsx)(
      import_system.chakra.a,
      {
        ...rest,
        ref,
        className: (0, import_shared_utils.cx)("chakra-linkbox__overlay", className),
        rel: isExternal ? "noopener noreferrer" : rel,
        target: isExternal ? "_blank" : target,
        __css: {
          position: "static",
          "&::before": {
            content: "''",
            cursor: "inherit",
            display: "block",
            position: "absolute",
            top: 0,
            left: 0,
            zIndex: 0,
            width: "100%",
            height: "100%"
          }
        }
      }
    );
  }
);
var LinkBox = (0, import_system.forwardRef)(function LinkBox2(props, ref) {
  const { className, ...rest } = props;
  return /* @__PURE__ */ (0, import_jsx_runtime.jsx)(
    import_system.chakra.div,
    {
      ref,
      position: "relative",
      ...rest,
      className: (0, import_shared_utils.cx)("chakra-linkbox", className),
      __css: {
        /* Elevate the links and abbreviations up */
        "a[href]:not(.chakra-linkbox__overlay), abbr[title]": {
          position: "relative",
          zIndex: 1
        }
      }
    }
  );
});
// Annotate the CommonJS export names for ESM import in node:
0 && (module.exports = {
  LinkBox,
  LinkOverlay
});
//# sourceMappingURL=link-box.js.map
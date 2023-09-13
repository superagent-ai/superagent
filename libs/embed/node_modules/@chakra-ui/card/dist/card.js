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

// src/card.tsx
var card_exports = {};
__export(card_exports, {
  Card: () => Card
});
module.exports = __toCommonJS(card_exports);
var import_shared_utils = require("@chakra-ui/shared-utils");
var import_system2 = require("@chakra-ui/system");

// src/card-context.tsx
var import_system = require("@chakra-ui/system");
var [CardStylesProvider, useCardStyles] = (0, import_system.createStylesContext)("Card");

// src/card.tsx
var import_jsx_runtime = require("react/jsx-runtime");
var Card = (0, import_system2.forwardRef)(function Card2(props, ref) {
  const {
    className,
    children,
    direction = "column",
    justify,
    align,
    ...rest
  } = (0, import_system2.omitThemingProps)(props);
  const styles = (0, import_system2.useMultiStyleConfig)("Card", props);
  return /* @__PURE__ */ (0, import_jsx_runtime.jsx)(
    import_system2.chakra.div,
    {
      ref,
      className: (0, import_shared_utils.cx)("chakra-card", className),
      __css: {
        display: "flex",
        flexDirection: direction,
        justifyContent: justify,
        alignItems: align,
        position: "relative",
        minWidth: 0,
        wordWrap: "break-word",
        ...styles.container
      },
      ...rest,
      children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(CardStylesProvider, { value: styles, children })
    }
  );
});
// Annotate the CommonJS export names for ESM import in node:
0 && (module.exports = {
  Card
});
//# sourceMappingURL=card.js.map
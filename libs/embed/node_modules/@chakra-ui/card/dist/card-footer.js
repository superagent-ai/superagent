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

// src/card-footer.tsx
var card_footer_exports = {};
__export(card_footer_exports, {
  CardFooter: () => CardFooter
});
module.exports = __toCommonJS(card_footer_exports);
var import_shared_utils = require("@chakra-ui/shared-utils");
var import_system2 = require("@chakra-ui/system");

// src/card-context.tsx
var import_system = require("@chakra-ui/system");
var [CardStylesProvider, useCardStyles] = (0, import_system.createStylesContext)("Card");

// src/card-footer.tsx
var import_jsx_runtime = require("react/jsx-runtime");
var CardFooter = (0, import_system2.forwardRef)(
  function CardFooter2(props, ref) {
    const { className, justify, ...rest } = props;
    const styles = useCardStyles();
    return /* @__PURE__ */ (0, import_jsx_runtime.jsx)(
      import_system2.chakra.div,
      {
        ref,
        className: (0, import_shared_utils.cx)("chakra-card__footer", className),
        __css: {
          display: "flex",
          justifyContent: justify,
          ...styles.footer
        },
        ...rest
      }
    );
  }
);
// Annotate the CommonJS export names for ESM import in node:
0 && (module.exports = {
  CardFooter
});
//# sourceMappingURL=card-footer.js.map
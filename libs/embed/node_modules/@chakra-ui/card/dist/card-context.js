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

// src/card-context.tsx
var card_context_exports = {};
__export(card_context_exports, {
  CardStylesProvider: () => CardStylesProvider,
  useCardStyles: () => useCardStyles
});
module.exports = __toCommonJS(card_context_exports);
var import_system = require("@chakra-ui/system");
var [CardStylesProvider, useCardStyles] = (0, import_system.createStylesContext)("Card");
// Annotate the CommonJS export names for ESM import in node:
0 && (module.exports = {
  CardStylesProvider,
  useCardStyles
});
//# sourceMappingURL=card-context.js.map
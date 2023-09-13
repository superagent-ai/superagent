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

// src/avatar-name.tsx
var avatar_name_exports = {};
__export(avatar_name_exports, {
  AvatarName: () => AvatarName,
  initials: () => initials
});
module.exports = __toCommonJS(avatar_name_exports);
var import_system = require("@chakra-ui/system");

// src/avatar-context.tsx
var import_react_context = require("@chakra-ui/react-context");
var [AvatarStylesProvider, useAvatarStyles] = (0, import_react_context.createContext)({
  name: `AvatarStylesContext`,
  hookName: `useAvatarStyles`,
  providerName: "<Avatar/>"
});

// src/avatar-name.tsx
var import_jsx_runtime = require("react/jsx-runtime");
function initials(name) {
  var _a;
  const names = name.split(" ");
  const firstName = (_a = names[0]) != null ? _a : "";
  const lastName = names.length > 1 ? names[names.length - 1] : "";
  return firstName && lastName ? `${firstName.charAt(0)}${lastName.charAt(0)}` : firstName.charAt(0);
}
function AvatarName(props) {
  const { name, getInitials, ...rest } = props;
  const styles = useAvatarStyles();
  return /* @__PURE__ */ (0, import_jsx_runtime.jsx)(import_system.chakra.div, { role: "img", "aria-label": name, ...rest, __css: styles.label, children: name ? getInitials == null ? void 0 : getInitials(name) : null });
}
AvatarName.displayName = "AvatarName";
// Annotate the CommonJS export names for ESM import in node:
0 && (module.exports = {
  AvatarName,
  initials
});
//# sourceMappingURL=avatar-name.js.map
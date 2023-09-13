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
  Stat: () => Stat,
  StatArrow: () => StatArrow,
  StatDownArrow: () => StatDownArrow,
  StatGroup: () => StatGroup,
  StatHelpText: () => StatHelpText,
  StatLabel: () => StatLabel,
  StatNumber: () => StatNumber,
  StatUpArrow: () => StatUpArrow,
  useStatStyles: () => useStatStyles
});
module.exports = __toCommonJS(src_exports);

// src/stat.tsx
var import_react_context = require("@chakra-ui/react-context");
var import_system = require("@chakra-ui/system");
var import_shared_utils = require("@chakra-ui/shared-utils");
var import_jsx_runtime = require("react/jsx-runtime");
var [StatStylesProvider, useStatStyles] = (0, import_react_context.createContext)({
  name: `StatStylesContext`,
  errorMessage: `useStatStyles returned is 'undefined'. Seems you forgot to wrap the components in "<Stat />" `
});
var Stat = (0, import_system.forwardRef)(function Stat2(props, ref) {
  const styles = (0, import_system.useMultiStyleConfig)("Stat", props);
  const statStyles = {
    position: "relative",
    flex: "1 1 0%",
    ...styles.container
  };
  const { className, children, ...rest } = (0, import_system.omitThemingProps)(props);
  return /* @__PURE__ */ (0, import_jsx_runtime.jsx)(StatStylesProvider, { value: styles, children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(
    import_system.chakra.div,
    {
      ref,
      ...rest,
      className: (0, import_shared_utils.cx)("chakra-stat", className),
      __css: statStyles,
      children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)("dl", { children })
    }
  ) });
});
Stat.displayName = "Stat";

// src/stat-arrow.tsx
var import_icon = require("@chakra-ui/icon");
var import_system2 = require("@chakra-ui/system");
var import_jsx_runtime2 = require("react/jsx-runtime");
var StatDownArrow = (props) => /* @__PURE__ */ (0, import_jsx_runtime2.jsx)(import_icon.Icon, { color: "red.400", ...props, children: /* @__PURE__ */ (0, import_jsx_runtime2.jsx)(
  "path",
  {
    fill: "currentColor",
    d: "M21,5H3C2.621,5,2.275,5.214,2.105,5.553C1.937,5.892,1.973,6.297,2.2,6.6l9,12 c0.188,0.252,0.485,0.4,0.8,0.4s0.611-0.148,0.8-0.4l9-12c0.228-0.303,0.264-0.708,0.095-1.047C21.725,5.214,21.379,5,21,5z"
  }
) });
StatDownArrow.displayName = "StatDownArrow";
function StatUpArrow(props) {
  return /* @__PURE__ */ (0, import_jsx_runtime2.jsx)(import_icon.Icon, { color: "green.400", ...props, children: /* @__PURE__ */ (0, import_jsx_runtime2.jsx)(
    "path",
    {
      fill: "currentColor",
      d: "M12.8,5.4c-0.377-0.504-1.223-0.504-1.6,0l-9,12c-0.228,0.303-0.264,0.708-0.095,1.047 C2.275,18.786,2.621,19,3,19h18c0.379,0,0.725-0.214,0.895-0.553c0.169-0.339,0.133-0.744-0.095-1.047L12.8,5.4z"
    }
  ) });
}
StatUpArrow.displayName = "StatUpArrow";
function StatArrow(props) {
  const { type, "aria-label": ariaLabel, ...rest } = props;
  const styles = useStatStyles();
  const BaseIcon = type === "increase" ? StatUpArrow : StatDownArrow;
  const defaultAriaLabel = type === "increase" ? "increased by" : "decreased by";
  const label = ariaLabel || defaultAriaLabel;
  return /* @__PURE__ */ (0, import_jsx_runtime2.jsxs)(import_jsx_runtime2.Fragment, { children: [
    /* @__PURE__ */ (0, import_jsx_runtime2.jsx)(import_system2.chakra.span, { srOnly: true, children: label }),
    /* @__PURE__ */ (0, import_jsx_runtime2.jsx)(BaseIcon, { "aria-hidden": true, ...rest, __css: styles.icon })
  ] });
}
StatArrow.displayName = "StatArrow";

// src/stat-group.tsx
var import_shared_utils2 = require("@chakra-ui/shared-utils");
var import_system3 = require("@chakra-ui/system");
var import_jsx_runtime3 = require("react/jsx-runtime");
var StatGroup = (0, import_system3.forwardRef)(function StatGroup2(props, ref) {
  return /* @__PURE__ */ (0, import_jsx_runtime3.jsx)(
    import_system3.chakra.div,
    {
      ...props,
      ref,
      role: "group",
      className: (0, import_shared_utils2.cx)("chakra-stat__group", props.className),
      __css: {
        display: "flex",
        flexWrap: "wrap",
        justifyContent: "space-around",
        alignItems: "flex-start"
      }
    }
  );
});
StatGroup.displayName = "StatGroup";

// src/stat-help-text.tsx
var import_shared_utils3 = require("@chakra-ui/shared-utils");
var import_system4 = require("@chakra-ui/system");
var import_jsx_runtime4 = require("react/jsx-runtime");
var StatHelpText = (0, import_system4.forwardRef)(
  function StatHelpText2(props, ref) {
    const styles = useStatStyles();
    return /* @__PURE__ */ (0, import_jsx_runtime4.jsx)(
      import_system4.chakra.dd,
      {
        ref,
        ...props,
        className: (0, import_shared_utils3.cx)("chakra-stat__help-text", props.className),
        __css: styles.helpText
      }
    );
  }
);
StatHelpText.displayName = "StatHelpText";

// src/stat-label.tsx
var import_shared_utils4 = require("@chakra-ui/shared-utils");
var import_system5 = require("@chakra-ui/system");
var import_jsx_runtime5 = require("react/jsx-runtime");
var StatLabel = (0, import_system5.forwardRef)(function StatLabel2(props, ref) {
  const styles = useStatStyles();
  return /* @__PURE__ */ (0, import_jsx_runtime5.jsx)(
    import_system5.chakra.dt,
    {
      ref,
      ...props,
      className: (0, import_shared_utils4.cx)("chakra-stat__label", props.className),
      __css: styles.label
    }
  );
});
StatLabel.displayName = "StatLabel";

// src/stat-number.tsx
var import_shared_utils5 = require("@chakra-ui/shared-utils");
var import_system6 = require("@chakra-ui/system");
var import_jsx_runtime6 = require("react/jsx-runtime");
var StatNumber = (0, import_system6.forwardRef)(function StatNumber2(props, ref) {
  const styles = useStatStyles();
  return /* @__PURE__ */ (0, import_jsx_runtime6.jsx)(
    import_system6.chakra.dd,
    {
      ref,
      ...props,
      className: (0, import_shared_utils5.cx)("chakra-stat__number", props.className),
      __css: {
        ...styles.number,
        fontFeatureSettings: "pnum",
        fontVariantNumeric: "proportional-nums"
      }
    }
  );
});
StatNumber.displayName = "StatNumber";
// Annotate the CommonJS export names for ESM import in node:
0 && (module.exports = {
  Stat,
  StatArrow,
  StatDownArrow,
  StatGroup,
  StatHelpText,
  StatLabel,
  StatNumber,
  StatUpArrow,
  useStatStyles
});
//# sourceMappingURL=index.js.map
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
  Table: () => Table,
  TableCaption: () => TableCaption,
  TableContainer: () => TableContainer,
  Tbody: () => Tbody,
  Td: () => Td,
  Tfoot: () => Tfoot,
  Th: () => Th,
  Thead: () => Thead,
  Tr: () => Tr,
  useTableStyles: () => useTableStyles
});
module.exports = __toCommonJS(src_exports);

// src/table.tsx
var import_system = require("@chakra-ui/system");
var import_shared_utils = require("@chakra-ui/shared-utils");
var import_react_context = require("@chakra-ui/react-context");
var import_jsx_runtime = require("react/jsx-runtime");
var [TableStylesProvider, useTableStyles] = (0, import_react_context.createContext)({
  name: `TableStylesContext`,
  errorMessage: `useTableStyles returned is 'undefined'. Seems you forgot to wrap the components in "<Table />" `
});
var Table = (0, import_system.forwardRef)((props, ref) => {
  const styles = (0, import_system.useMultiStyleConfig)("Table", props);
  const { className, layout, ...tableProps } = (0, import_system.omitThemingProps)(props);
  return /* @__PURE__ */ (0, import_jsx_runtime.jsx)(TableStylesProvider, { value: styles, children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(
    import_system.chakra.table,
    {
      ref,
      __css: { tableLayout: layout, ...styles.table },
      className: (0, import_shared_utils.cx)("chakra-table", className),
      ...tableProps
    }
  ) });
});
Table.displayName = "Table";

// src/table-caption.tsx
var import_system2 = require("@chakra-ui/system");
var import_jsx_runtime2 = require("react/jsx-runtime");
var TableCaption = (0, import_system2.forwardRef)(
  (props, ref) => {
    const { placement = "bottom", ...rest } = props;
    const styles = useTableStyles();
    return /* @__PURE__ */ (0, import_jsx_runtime2.jsx)(
      import_system2.chakra.caption,
      {
        ...rest,
        ref,
        __css: {
          ...styles.caption,
          captionSide: placement
        }
      }
    );
  }
);
TableCaption.displayName = "TableCaption";

// src/table-container.tsx
var import_system3 = require("@chakra-ui/system");
var import_shared_utils2 = require("@chakra-ui/shared-utils");
var import_jsx_runtime3 = require("react/jsx-runtime");
var TableContainer = (0, import_system3.forwardRef)(
  (props, ref) => {
    var _a;
    const { overflow, overflowX, className, ...rest } = props;
    return /* @__PURE__ */ (0, import_jsx_runtime3.jsx)(
      import_system3.chakra.div,
      {
        ref,
        className: (0, import_shared_utils2.cx)("chakra-table__container", className),
        ...rest,
        __css: {
          display: "block",
          whiteSpace: "nowrap",
          WebkitOverflowScrolling: "touch",
          overflowX: (_a = overflow != null ? overflow : overflowX) != null ? _a : "auto",
          overflowY: "hidden",
          maxWidth: "100%"
        }
      }
    );
  }
);

// src/tbody.tsx
var import_system4 = require("@chakra-ui/system");
var import_jsx_runtime4 = require("react/jsx-runtime");
var Tbody = (0, import_system4.forwardRef)((props, ref) => {
  const styles = useTableStyles();
  return /* @__PURE__ */ (0, import_jsx_runtime4.jsx)(import_system4.chakra.tbody, { ...props, ref, __css: styles.tbody });
});

// src/td.tsx
var import_system5 = require("@chakra-ui/system");
var import_jsx_runtime5 = require("react/jsx-runtime");
var Td = (0, import_system5.forwardRef)(
  ({ isNumeric, ...rest }, ref) => {
    const styles = useTableStyles();
    return /* @__PURE__ */ (0, import_jsx_runtime5.jsx)(
      import_system5.chakra.td,
      {
        ...rest,
        ref,
        __css: styles.td,
        "data-is-numeric": isNumeric
      }
    );
  }
);

// src/tfooter.tsx
var import_system6 = require("@chakra-ui/system");
var import_jsx_runtime6 = require("react/jsx-runtime");
var Tfoot = (0, import_system6.forwardRef)((props, ref) => {
  const styles = useTableStyles();
  return /* @__PURE__ */ (0, import_jsx_runtime6.jsx)(import_system6.chakra.tfoot, { ...props, ref, __css: styles.tfoot });
});

// src/th.tsx
var import_system7 = require("@chakra-ui/system");
var import_jsx_runtime7 = require("react/jsx-runtime");
var Th = (0, import_system7.forwardRef)(
  ({ isNumeric, ...rest }, ref) => {
    const styles = useTableStyles();
    return /* @__PURE__ */ (0, import_jsx_runtime7.jsx)(
      import_system7.chakra.th,
      {
        ...rest,
        ref,
        __css: styles.th,
        "data-is-numeric": isNumeric
      }
    );
  }
);

// src/thead.tsx
var import_system8 = require("@chakra-ui/system");
var import_jsx_runtime8 = require("react/jsx-runtime");
var Thead = (0, import_system8.forwardRef)((props, ref) => {
  const styles = useTableStyles();
  return /* @__PURE__ */ (0, import_jsx_runtime8.jsx)(import_system8.chakra.thead, { ...props, ref, __css: styles.thead });
});

// src/tr.tsx
var import_system9 = require("@chakra-ui/system");
var import_jsx_runtime9 = require("react/jsx-runtime");
var Tr = (0, import_system9.forwardRef)((props, ref) => {
  const styles = useTableStyles();
  return /* @__PURE__ */ (0, import_jsx_runtime9.jsx)(import_system9.chakra.tr, { ...props, ref, __css: styles.tr });
});
// Annotate the CommonJS export names for ESM import in node:
0 && (module.exports = {
  Table,
  TableCaption,
  TableContainer,
  Tbody,
  Td,
  Tfoot,
  Th,
  Thead,
  Tr,
  useTableStyles
});
//# sourceMappingURL=index.js.map
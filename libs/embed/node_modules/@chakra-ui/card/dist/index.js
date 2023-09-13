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
  Card: () => Card,
  CardBody: () => CardBody,
  CardFooter: () => CardFooter,
  CardHeader: () => CardHeader,
  useCardStyles: () => useCardStyles
});
module.exports = __toCommonJS(src_exports);

// src/card.tsx
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

// src/card-body.tsx
var import_shared_utils2 = require("@chakra-ui/shared-utils");
var import_system3 = require("@chakra-ui/system");
var import_jsx_runtime2 = require("react/jsx-runtime");
var CardBody = (0, import_system3.forwardRef)(function CardBody2(props, ref) {
  const { className, ...rest } = props;
  const styles = useCardStyles();
  return /* @__PURE__ */ (0, import_jsx_runtime2.jsx)(
    import_system3.chakra.div,
    {
      ref,
      className: (0, import_shared_utils2.cx)("chakra-card__body", className),
      __css: styles.body,
      ...rest
    }
  );
});

// src/card-footer.tsx
var import_shared_utils3 = require("@chakra-ui/shared-utils");
var import_system4 = require("@chakra-ui/system");
var import_jsx_runtime3 = require("react/jsx-runtime");
var CardFooter = (0, import_system4.forwardRef)(
  function CardFooter2(props, ref) {
    const { className, justify, ...rest } = props;
    const styles = useCardStyles();
    return /* @__PURE__ */ (0, import_jsx_runtime3.jsx)(
      import_system4.chakra.div,
      {
        ref,
        className: (0, import_shared_utils3.cx)("chakra-card__footer", className),
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

// src/card-header.tsx
var import_shared_utils4 = require("@chakra-ui/shared-utils");
var import_system5 = require("@chakra-ui/system");
var import_jsx_runtime4 = require("react/jsx-runtime");
var CardHeader = (0, import_system5.forwardRef)(
  function CardHeader2(props, ref) {
    const { className, ...rest } = props;
    const styles = useCardStyles();
    return /* @__PURE__ */ (0, import_jsx_runtime4.jsx)(
      import_system5.chakra.div,
      {
        ref,
        className: (0, import_shared_utils4.cx)("chakra-card__header", className),
        __css: styles.header,
        ...rest
      }
    );
  }
);
// Annotate the CommonJS export names for ESM import in node:
0 && (module.exports = {
  Card,
  CardBody,
  CardFooter,
  CardHeader,
  useCardStyles
});
//# sourceMappingURL=index.js.map
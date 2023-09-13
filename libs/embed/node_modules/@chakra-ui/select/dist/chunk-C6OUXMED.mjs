'use client'

// src/select-field.tsx
import { cx } from "@chakra-ui/shared-utils";
import { chakra, forwardRef } from "@chakra-ui/system";
import { jsx, jsxs } from "react/jsx-runtime";
var SelectField = forwardRef(
  function SelectField2(props, ref) {
    const { children, placeholder, className, ...rest } = props;
    return /* @__PURE__ */ jsxs(
      chakra.select,
      {
        ...rest,
        ref,
        className: cx("chakra-select", className),
        children: [
          placeholder && /* @__PURE__ */ jsx("option", { value: "", children: placeholder }),
          children
        ]
      }
    );
  }
);
SelectField.displayName = "SelectField";

export {
  SelectField
};
//# sourceMappingURL=chunk-C6OUXMED.mjs.map
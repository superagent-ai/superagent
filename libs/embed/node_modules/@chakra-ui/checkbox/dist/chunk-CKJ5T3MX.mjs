'use client'
import {
  CheckboxGroupProvider
} from "./chunk-LYGBQ47X.mjs";
import {
  useCheckboxGroup
} from "./chunk-TOQK4WO2.mjs";

// src/checkbox-group.tsx
import { useMemo } from "react";
import { jsx } from "react/jsx-runtime";
function CheckboxGroup(props) {
  const { colorScheme, size, variant, children, isDisabled } = props;
  const { value, onChange } = useCheckboxGroup(props);
  const group = useMemo(
    () => ({
      size,
      onChange,
      colorScheme,
      value,
      variant,
      isDisabled
    }),
    [size, onChange, colorScheme, value, variant, isDisabled]
  );
  return /* @__PURE__ */ jsx(CheckboxGroupProvider, { value: group, children });
}
CheckboxGroup.displayName = "CheckboxGroup";

export {
  CheckboxGroup
};
//# sourceMappingURL=chunk-CKJ5T3MX.mjs.map
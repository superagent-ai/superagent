'use client'
import {
  commonStyles
} from "./chunk-6XCKNNTK.mjs";
import {
  useEditableContext,
  useEditableStyles
} from "./chunk-WYY72ITE.mjs";

// src/editable-input.tsx
import { chakra, forwardRef } from "@chakra-ui/system";
import { cx } from "@chakra-ui/shared-utils";
import { jsx } from "react/jsx-runtime";
var EditableInput = forwardRef(
  function EditableInput2(props, ref) {
    const { getInputProps } = useEditableContext();
    const styles = useEditableStyles();
    const inputProps = getInputProps(props, ref);
    const _className = cx("chakra-editable__input", props.className);
    return /* @__PURE__ */ jsx(
      chakra.input,
      {
        ...inputProps,
        __css: {
          outline: 0,
          ...commonStyles,
          ...styles.input
        },
        className: _className
      }
    );
  }
);
EditableInput.displayName = "EditableInput";

export {
  EditableInput
};
//# sourceMappingURL=chunk-7XO4TBDN.mjs.map
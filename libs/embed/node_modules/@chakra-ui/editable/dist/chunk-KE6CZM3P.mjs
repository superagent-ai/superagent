'use client'
import {
  commonStyles
} from "./chunk-6XCKNNTK.mjs";
import {
  useEditableContext,
  useEditableStyles
} from "./chunk-WYY72ITE.mjs";

// src/editable-textarea.tsx
import { chakra, forwardRef } from "@chakra-ui/system";
import { cx } from "@chakra-ui/shared-utils";
import { jsx } from "react/jsx-runtime";
var EditableTextarea = forwardRef(
  function EditableTextarea2(props, ref) {
    const { getTextareaProps } = useEditableContext();
    const styles = useEditableStyles();
    const textareaProps = getTextareaProps(props, ref);
    const _className = cx("chakra-editable__textarea", props.className);
    return /* @__PURE__ */ jsx(
      chakra.textarea,
      {
        ...textareaProps,
        __css: {
          outline: 0,
          ...commonStyles,
          ...styles.textarea
        },
        className: _className
      }
    );
  }
);
EditableTextarea.displayName = "EditableTextarea";

export {
  EditableTextarea
};
//# sourceMappingURL=chunk-KE6CZM3P.mjs.map
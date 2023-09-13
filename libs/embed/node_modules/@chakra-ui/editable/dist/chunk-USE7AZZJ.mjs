'use client'
import {
  commonStyles
} from "./chunk-6XCKNNTK.mjs";
import {
  useEditableContext,
  useEditableStyles
} from "./chunk-WYY72ITE.mjs";

// src/editable-preview.tsx
import { chakra, forwardRef } from "@chakra-ui/system";
import { cx } from "@chakra-ui/shared-utils";
import { jsx } from "react/jsx-runtime";
var EditablePreview = forwardRef(
  function EditablePreview2(props, ref) {
    const { getPreviewProps } = useEditableContext();
    const styles = useEditableStyles();
    const previewProps = getPreviewProps(props, ref);
    const _className = cx("chakra-editable__preview", props.className);
    return /* @__PURE__ */ jsx(
      chakra.span,
      {
        ...previewProps,
        __css: {
          cursor: "text",
          display: "inline-block",
          ...commonStyles,
          ...styles.preview
        },
        className: _className
      }
    );
  }
);
EditablePreview.displayName = "EditablePreview";

export {
  EditablePreview
};
//# sourceMappingURL=chunk-USE7AZZJ.mjs.map
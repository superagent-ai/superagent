'use client'
import {
  useEditable
} from "./chunk-TXN5ELBN.mjs";
import {
  EditableProvider,
  EditableStylesProvider
} from "./chunk-WYY72ITE.mjs";

// src/editable.tsx
import { cx, runIfFn } from "@chakra-ui/shared-utils";
import {
  chakra,
  forwardRef,
  omitThemingProps,
  useMultiStyleConfig
} from "@chakra-ui/system";
import { jsx } from "react/jsx-runtime";
var Editable = forwardRef(function Editable2(props, ref) {
  const styles = useMultiStyleConfig("Editable", props);
  const ownProps = omitThemingProps(props);
  const { htmlProps, ...context } = useEditable(ownProps);
  const { isEditing, onSubmit, onCancel, onEdit } = context;
  const _className = cx("chakra-editable", props.className);
  const children = runIfFn(props.children, {
    isEditing,
    onSubmit,
    onCancel,
    onEdit
  });
  return /* @__PURE__ */ jsx(EditableProvider, { value: context, children: /* @__PURE__ */ jsx(EditableStylesProvider, { value: styles, children: /* @__PURE__ */ jsx(
    chakra.div,
    {
      ref,
      ...htmlProps,
      className: _className,
      children
    }
  ) }) });
});
Editable.displayName = "Editable";

export {
  Editable
};
//# sourceMappingURL=chunk-ROCN3PRT.mjs.map
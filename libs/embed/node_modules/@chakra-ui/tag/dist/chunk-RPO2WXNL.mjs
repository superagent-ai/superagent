'use client'

// src/tag.tsx
import { Icon } from "@chakra-ui/icon";
import { createContext } from "@chakra-ui/react-context";
import {
  chakra,
  forwardRef,
  omitThemingProps,
  useMultiStyleConfig
} from "@chakra-ui/system";
import { jsx } from "react/jsx-runtime";
var [TagStylesProvider, useTagStyles] = createContext({
  name: `TagStylesContext`,
  errorMessage: `useTagStyles returned is 'undefined'. Seems you forgot to wrap the components in "<Tag />" `
});
var Tag = forwardRef((props, ref) => {
  const styles = useMultiStyleConfig("Tag", props);
  const ownProps = omitThemingProps(props);
  const containerStyles = {
    display: "inline-flex",
    verticalAlign: "top",
    alignItems: "center",
    maxWidth: "100%",
    ...styles.container
  };
  return /* @__PURE__ */ jsx(TagStylesProvider, { value: styles, children: /* @__PURE__ */ jsx(chakra.span, { ref, ...ownProps, __css: containerStyles }) });
});
Tag.displayName = "Tag";
var TagLabel = forwardRef((props, ref) => {
  const styles = useTagStyles();
  return /* @__PURE__ */ jsx(chakra.span, { ref, noOfLines: 1, ...props, __css: styles.label });
});
TagLabel.displayName = "TagLabel";
var TagLeftIcon = forwardRef((props, ref) => /* @__PURE__ */ jsx(Icon, { ref, verticalAlign: "top", marginEnd: "0.5rem", ...props }));
TagLeftIcon.displayName = "TagLeftIcon";
var TagRightIcon = forwardRef((props, ref) => /* @__PURE__ */ jsx(Icon, { ref, verticalAlign: "top", marginStart: "0.5rem", ...props }));
TagRightIcon.displayName = "TagRightIcon";
var TagCloseIcon = (props) => /* @__PURE__ */ jsx(Icon, { verticalAlign: "inherit", viewBox: "0 0 512 512", ...props, children: /* @__PURE__ */ jsx(
  "path",
  {
    fill: "currentColor",
    d: "M289.94 256l95-95A24 24 0 00351 127l-95 95-95-95a24 24 0 00-34 34l95 95-95 95a24 24 0 1034 34l95-95 95 95a24 24 0 0034-34z"
  }
) });
TagCloseIcon.displayName = "TagCloseIcon";
var TagCloseButton = forwardRef(
  (props, ref) => {
    const { isDisabled, children, ...rest } = props;
    const styles = useTagStyles();
    const btnStyles = {
      display: "flex",
      alignItems: "center",
      justifyContent: "center",
      outline: "0",
      ...styles.closeButton
    };
    return /* @__PURE__ */ jsx(
      chakra.button,
      {
        ref,
        "aria-label": "close",
        ...rest,
        type: "button",
        disabled: isDisabled,
        __css: btnStyles,
        children: children || /* @__PURE__ */ jsx(TagCloseIcon, {})
      }
    );
  }
);
TagCloseButton.displayName = "TagCloseButton";

export {
  useTagStyles,
  Tag,
  TagLabel,
  TagLeftIcon,
  TagRightIcon,
  TagCloseButton
};
//# sourceMappingURL=chunk-RPO2WXNL.mjs.map
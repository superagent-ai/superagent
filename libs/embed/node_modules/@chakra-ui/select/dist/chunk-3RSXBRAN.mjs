'use client'
import {
  SelectField
} from "./chunk-C6OUXMED.mjs";

// src/select.tsx
import { useFormControl } from "@chakra-ui/form-control";
import {
  chakra,
  forwardRef,
  layoutPropNames,
  omitThemingProps,
  useMultiStyleConfig
} from "@chakra-ui/system";
import { dataAttr } from "@chakra-ui/shared-utils";

// ../../utilities/object-utils/src/split.ts
function split(object, keys) {
  const picked = {};
  const omitted = {};
  for (const [key, value] of Object.entries(object)) {
    if (keys.includes(key))
      picked[key] = value;
    else
      omitted[key] = value;
  }
  return [picked, omitted];
}

// src/select.tsx
import { cloneElement, isValidElement } from "react";
import { jsx, jsxs } from "react/jsx-runtime";
var Select = forwardRef((props, ref) => {
  var _a;
  const styles = useMultiStyleConfig("Select", props);
  const {
    rootProps,
    placeholder,
    icon,
    color,
    height,
    h,
    minH,
    minHeight,
    iconColor,
    iconSize,
    ...rest
  } = omitThemingProps(props);
  const [layoutProps, otherProps] = split(rest, layoutPropNames);
  const ownProps = useFormControl(otherProps);
  const rootStyles = {
    width: "100%",
    height: "fit-content",
    position: "relative",
    color
  };
  const fieldStyles = {
    paddingEnd: "2rem",
    ...styles.field,
    _focus: {
      zIndex: "unset",
      ...(_a = styles.field) == null ? void 0 : _a["_focus"]
    }
  };
  return /* @__PURE__ */ jsxs(
    chakra.div,
    {
      className: "chakra-select__wrapper",
      __css: rootStyles,
      ...layoutProps,
      ...rootProps,
      children: [
        /* @__PURE__ */ jsx(
          SelectField,
          {
            ref,
            height: h != null ? h : height,
            minH: minH != null ? minH : minHeight,
            placeholder,
            ...ownProps,
            __css: fieldStyles,
            children: props.children
          }
        ),
        /* @__PURE__ */ jsx(
          SelectIcon,
          {
            "data-disabled": dataAttr(ownProps.disabled),
            ...(iconColor || color) && { color: iconColor || color },
            __css: styles.icon,
            ...iconSize && { fontSize: iconSize },
            children: icon
          }
        )
      ]
    }
  );
});
Select.displayName = "Select";
var DefaultIcon = (props) => /* @__PURE__ */ jsx("svg", { viewBox: "0 0 24 24", ...props, children: /* @__PURE__ */ jsx(
  "path",
  {
    fill: "currentColor",
    d: "M16.59 8.59L12 13.17 7.41 8.59 6 10l6 6 6-6z"
  }
) });
var IconWrapper = chakra("div", {
  baseStyle: {
    position: "absolute",
    display: "inline-flex",
    alignItems: "center",
    justifyContent: "center",
    pointerEvents: "none",
    top: "50%",
    transform: "translateY(-50%)"
  }
});
var SelectIcon = (props) => {
  const { children = /* @__PURE__ */ jsx(DefaultIcon, {}), ...rest } = props;
  const clone = cloneElement(children, {
    role: "presentation",
    className: "chakra-select__icon",
    focusable: false,
    "aria-hidden": true,
    // force icon to adhere to `IconWrapper` styles
    style: {
      width: "1em",
      height: "1em",
      color: "currentColor"
    }
  });
  return /* @__PURE__ */ jsx(IconWrapper, { ...rest, className: "chakra-select__icon-wrapper", children: isValidElement(children) ? clone : null });
};
SelectIcon.displayName = "SelectIcon";

export {
  Select,
  DefaultIcon
};
//# sourceMappingURL=chunk-3RSXBRAN.mjs.map
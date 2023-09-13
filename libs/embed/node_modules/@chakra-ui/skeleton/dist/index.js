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
  Skeleton: () => Skeleton,
  SkeletonCircle: () => SkeletonCircle,
  SkeletonText: () => SkeletonText
});
module.exports = __toCommonJS(src_exports);

// src/skeleton.tsx
var import_react_use_previous = require("@chakra-ui/react-use-previous");
var import_shared_utils = require("@chakra-ui/shared-utils");
var import_system = require("@chakra-ui/system");

// src/use-is-first-render.ts
var import_react = require("react");
function useIsFirstRender() {
  const isFirstRender = (0, import_react.useRef)(true);
  (0, import_react.useEffect)(() => {
    isFirstRender.current = false;
  }, []);
  return isFirstRender.current;
}

// src/skeleton.tsx
var import_jsx_runtime = require("react/jsx-runtime");
var StyledSkeleton = (0, import_system.chakra)("div", {
  baseStyle: {
    boxShadow: "none",
    backgroundClip: "padding-box",
    cursor: "default",
    color: "transparent",
    pointerEvents: "none",
    userSelect: "none",
    "&::before, &::after, *": {
      visibility: "hidden"
    }
  }
});
var $startColor = (0, import_system.cssVar)("skeleton-start-color");
var $endColor = (0, import_system.cssVar)("skeleton-end-color");
var fade = (0, import_system.keyframes)({
  from: { opacity: 0 },
  to: { opacity: 1 }
});
var bgFade = (0, import_system.keyframes)({
  from: {
    borderColor: $startColor.reference,
    background: $startColor.reference
  },
  to: {
    borderColor: $endColor.reference,
    background: $endColor.reference
  }
});
var Skeleton = (0, import_system.forwardRef)((props, ref) => {
  const skeletonProps = {
    ...props,
    fadeDuration: typeof props.fadeDuration === "number" ? props.fadeDuration : 0.4,
    speed: typeof props.speed === "number" ? props.speed : 0.8
  };
  const styles = (0, import_system.useStyleConfig)("Skeleton", skeletonProps);
  const isFirstRender = useIsFirstRender();
  const {
    startColor = "",
    endColor = "",
    isLoaded,
    fadeDuration,
    speed,
    className,
    fitContent,
    ...rest
  } = (0, import_system.omitThemingProps)(skeletonProps);
  const [startColorVar, endColorVar] = (0, import_system.useToken)("colors", [
    startColor,
    endColor
  ]);
  const wasPreviouslyLoaded = (0, import_react_use_previous.usePrevious)(isLoaded);
  const _className = (0, import_shared_utils.cx)("chakra-skeleton", className);
  const cssVarStyles = {
    ...startColorVar && { [$startColor.variable]: startColorVar },
    ...endColorVar && { [$endColor.variable]: endColorVar }
  };
  if (isLoaded) {
    const animation = isFirstRender || wasPreviouslyLoaded ? "none" : `${fade} ${fadeDuration}s`;
    return /* @__PURE__ */ (0, import_jsx_runtime.jsx)(
      import_system.chakra.div,
      {
        ref,
        className: _className,
        __css: { animation },
        ...rest
      }
    );
  }
  return /* @__PURE__ */ (0, import_jsx_runtime.jsx)(
    StyledSkeleton,
    {
      ref,
      className: _className,
      ...rest,
      __css: {
        width: fitContent ? "fit-content" : void 0,
        ...styles,
        ...cssVarStyles,
        _dark: { ...styles["_dark"], ...cssVarStyles },
        animation: `${speed}s linear infinite alternate ${bgFade}`
      }
    }
  );
});
Skeleton.displayName = "Skeleton";

// src/skeleton-text.tsx
var import_media_query = require("@chakra-ui/media-query");
var import_system2 = require("@chakra-ui/system");
var import_shared_utils2 = require("@chakra-ui/shared-utils");
var import_jsx_runtime2 = require("react/jsx-runtime");
function range(count) {
  return Array(count).fill(1).map((_, index) => index + 1);
}
var defaultNoOfLines = 3;
var SkeletonText = (props) => {
  const {
    noOfLines = defaultNoOfLines,
    spacing = "0.5rem",
    skeletonHeight = "0.5rem",
    className,
    startColor,
    endColor,
    isLoaded,
    fadeDuration,
    speed,
    variant,
    size,
    colorScheme,
    children,
    ...rest
  } = props;
  const noOfLinesValue = (0, import_media_query.useBreakpointValue)(
    typeof noOfLines === "number" ? [noOfLines] : noOfLines
  ) || defaultNoOfLines;
  const numbers = range(noOfLinesValue);
  const getWidth = (index) => {
    if (noOfLinesValue > 1) {
      return index === numbers.length ? "80%" : "100%";
    }
    return "100%";
  };
  const _className = (0, import_shared_utils2.cx)("chakra-skeleton__group", className);
  return /* @__PURE__ */ (0, import_jsx_runtime2.jsx)(import_system2.chakra.div, { className: _className, ...rest, children: numbers.map((number, index) => {
    if (isLoaded && index > 0) {
      return null;
    }
    const sizeProps = isLoaded ? null : {
      mb: number === numbers.length ? "0" : spacing,
      width: getWidth(number),
      height: skeletonHeight
    };
    return /* @__PURE__ */ (0, import_jsx_runtime2.jsx)(
      Skeleton,
      {
        startColor,
        endColor,
        isLoaded,
        fadeDuration,
        speed,
        variant,
        size,
        colorScheme,
        ...sizeProps,
        // allows animating the children
        children: index === 0 ? children : void 0
      },
      numbers.length.toString() + number
    );
  }) });
};
SkeletonText.displayName = "SkeletonText";

// src/skeleton-circle.tsx
var import_jsx_runtime3 = require("react/jsx-runtime");
var SkeletonCircle = ({
  size = "2rem",
  ...rest
}) => /* @__PURE__ */ (0, import_jsx_runtime3.jsx)(Skeleton, { borderRadius: "full", boxSize: size, ...rest });
SkeletonCircle.displayName = "SkeletonCircle";
// Annotate the CommonJS export names for ESM import in node:
0 && (module.exports = {
  Skeleton,
  SkeletonCircle,
  SkeletonText
});
//# sourceMappingURL=index.js.map
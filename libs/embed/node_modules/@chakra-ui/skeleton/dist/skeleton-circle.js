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

// src/skeleton-circle.tsx
var skeleton_circle_exports = {};
__export(skeleton_circle_exports, {
  SkeletonCircle: () => SkeletonCircle
});
module.exports = __toCommonJS(skeleton_circle_exports);

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

// src/skeleton-circle.tsx
var import_jsx_runtime2 = require("react/jsx-runtime");
var SkeletonCircle = ({
  size = "2rem",
  ...rest
}) => /* @__PURE__ */ (0, import_jsx_runtime2.jsx)(Skeleton, { borderRadius: "full", boxSize: size, ...rest });
SkeletonCircle.displayName = "SkeletonCircle";
// Annotate the CommonJS export names for ESM import in node:
0 && (module.exports = {
  SkeletonCircle
});
//# sourceMappingURL=skeleton-circle.js.map
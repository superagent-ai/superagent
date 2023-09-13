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

// src/use-breakpoint-value.ts
var use_breakpoint_value_exports = {};
__export(use_breakpoint_value_exports, {
  useBreakpointValue: () => useBreakpointValue
});
module.exports = __toCommonJS(use_breakpoint_value_exports);
var import_system2 = require("@chakra-ui/system");
var import_shared_utils2 = require("@chakra-ui/shared-utils");
var import_breakpoint_utils2 = require("@chakra-ui/breakpoint-utils");

// src/media-query.utils.ts
var import_breakpoint_utils = require("@chakra-ui/breakpoint-utils");
function getClosestValue(values, breakpoint, breakpoints = import_breakpoint_utils.breakpoints) {
  let index = Object.keys(values).indexOf(breakpoint);
  if (index !== -1) {
    return values[breakpoint];
  }
  let stopIndex = breakpoints.indexOf(breakpoint);
  while (stopIndex >= 0) {
    const key = breakpoints[stopIndex];
    if (values.hasOwnProperty(key)) {
      index = stopIndex;
      break;
    }
    stopIndex -= 1;
  }
  if (index !== -1) {
    const key = breakpoints[index];
    return values[key];
  }
  return void 0;
}

// src/use-breakpoint.ts
var import_system = require("@chakra-ui/system");
var import_shared_utils = require("@chakra-ui/shared-utils");

// src/use-media-query.ts
var import_react_env = require("@chakra-ui/react-env");
var import_react = require("react");
function useMediaQuery(query, options = {}) {
  const { ssr = true, fallback } = options;
  const { getWindow } = (0, import_react_env.useEnvironment)();
  const queries = Array.isArray(query) ? query : [query];
  let fallbackValues = Array.isArray(fallback) ? fallback : [fallback];
  fallbackValues = fallbackValues.filter((v) => v != null);
  const [value, setValue] = (0, import_react.useState)(() => {
    return queries.map((query2, index) => ({
      media: query2,
      matches: ssr ? !!fallbackValues[index] : getWindow().matchMedia(query2).matches
    }));
  });
  (0, import_react.useEffect)(() => {
    const win = getWindow();
    setValue(
      queries.map((query2) => ({
        media: query2,
        matches: win.matchMedia(query2).matches
      }))
    );
    const mql = queries.map((query2) => win.matchMedia(query2));
    const handler = (evt) => {
      setValue((prev) => {
        return prev.slice().map((item) => {
          if (item.media === evt.media)
            return { ...item, matches: evt.matches };
          return item;
        });
      });
    };
    mql.forEach((mql2) => {
      if (typeof mql2.addListener === "function") {
        mql2.addListener(handler);
      } else {
        mql2.addEventListener("change", handler);
      }
    });
    return () => {
      mql.forEach((mql2) => {
        if (typeof mql2.removeListener === "function") {
          mql2.removeListener(handler);
        } else {
          mql2.removeEventListener("change", handler);
        }
      });
    };
  }, [getWindow]);
  return value.map((item) => item.matches);
}

// src/use-breakpoint.ts
function useBreakpoint(arg) {
  var _a, _b;
  const opts = (0, import_shared_utils.isObject)(arg) ? arg : { fallback: arg != null ? arg : "base" };
  const theme = (0, import_system.useTheme)();
  const breakpoints = theme.__breakpoints.details.map(
    ({ minMaxQuery, breakpoint }) => ({
      breakpoint,
      query: minMaxQuery.replace("@media screen and ", "")
    })
  );
  const fallback = breakpoints.map((bp) => bp.breakpoint === opts.fallback);
  const values = useMediaQuery(
    breakpoints.map((bp) => bp.query),
    { fallback, ssr: opts.ssr }
  );
  const index = values.findIndex((value) => value == true);
  return (_b = (_a = breakpoints[index]) == null ? void 0 : _a.breakpoint) != null ? _b : opts.fallback;
}

// src/use-breakpoint-value.ts
function useBreakpointValue(values, arg) {
  var _a;
  const opts = (0, import_shared_utils2.isObject)(arg) ? arg : { fallback: arg != null ? arg : "base" };
  const breakpoint = useBreakpoint(opts);
  const theme = (0, import_system2.useTheme)();
  if (!breakpoint)
    return;
  const breakpoints = Array.from(((_a = theme.__breakpoints) == null ? void 0 : _a.keys) || []);
  const obj = Array.isArray(values) ? Object.fromEntries(
    Object.entries((0, import_breakpoint_utils2.arrayToObjectNotation)(values, breakpoints)).map(
      ([key, value]) => [key, value]
    )
  ) : values;
  return getClosestValue(obj, breakpoint, breakpoints);
}
// Annotate the CommonJS export names for ESM import in node:
0 && (module.exports = {
  useBreakpointValue
});
//# sourceMappingURL=use-breakpoint-value.js.map
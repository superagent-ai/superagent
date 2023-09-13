import {
  objectKeys
} from "./chunk-YTQ3XZ3T.mjs";
import {
  getLastItem
} from "./chunk-YTAYUX3P.mjs";
import {
  isArray,
  isObject
} from "./chunk-Y5FGD7DM.mjs";

// src/responsive.ts
var breakpoints = Object.freeze([
  "base",
  "sm",
  "md",
  "lg",
  "xl",
  "2xl"
]);
function mapResponsive(prop, mapper) {
  if (isArray(prop)) {
    return prop.map((item) => {
      if (item === null) {
        return null;
      }
      return mapper(item);
    });
  }
  if (isObject(prop)) {
    return objectKeys(prop).reduce((result, key) => {
      result[key] = mapper(prop[key]);
      return result;
    }, {});
  }
  if (prop != null) {
    return mapper(prop);
  }
  return null;
}
function objectToArrayNotation(obj, bps = breakpoints) {
  const result = bps.map((br) => {
    var _a;
    return (_a = obj[br]) != null ? _a : null;
  });
  while (getLastItem(result) === null) {
    result.pop();
  }
  return result;
}
function arrayToObjectNotation(values, bps = breakpoints) {
  const result = {};
  values.forEach((value, index) => {
    const key = bps[index];
    if (value == null)
      return;
    result[key] = value;
  });
  return result;
}
function isResponsiveObjectLike(obj, bps = breakpoints) {
  const keys = Object.keys(obj);
  return keys.length > 0 && keys.every((key) => bps.includes(key));
}
var isCustomBreakpoint = (maybeBreakpoint) => Number.isNaN(Number(maybeBreakpoint));

export {
  breakpoints,
  mapResponsive,
  objectToArrayNotation,
  arrayToObjectNotation,
  isResponsiveObjectLike,
  isCustomBreakpoint
};

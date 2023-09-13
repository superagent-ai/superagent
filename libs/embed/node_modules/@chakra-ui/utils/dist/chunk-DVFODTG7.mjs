import {
  fromEntries
} from "./chunk-YTQ3XZ3T.mjs";
import {
  isArray,
  isObject
} from "./chunk-Y5FGD7DM.mjs";

// src/walk-object.ts
function walkObject(target, predicate) {
  function inner(value, path = []) {
    if (isArray(value)) {
      return value.map((item, index) => inner(item, [...path, String(index)]));
    }
    if (isObject(value)) {
      return fromEntries(
        Object.entries(value).map(([key, child]) => [
          key,
          inner(child, [...path, key])
        ])
      );
    }
    return predicate(value, path);
  }
  return inner(target);
}

export {
  walkObject
};

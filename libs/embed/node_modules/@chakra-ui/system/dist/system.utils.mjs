'use client'

// src/system.utils.ts
import { isString, __DEV__ } from "@chakra-ui/utils";
function isTag(target) {
  return isString(target) && (__DEV__ ? target.charAt(0) === target.charAt(0).toLowerCase() : true);
}
function getDisplayName(primitive) {
  return isTag(primitive) ? `chakra.${primitive}` : getComponentName(primitive);
}
function getComponentName(primitive) {
  return (__DEV__ ? isString(primitive) && primitive : false) || !isString(primitive) && primitive.displayName || !isString(primitive) && primitive.name || "ChakraComponent";
}
export {
  isTag as default,
  getDisplayName
};
//# sourceMappingURL=system.utils.mjs.map
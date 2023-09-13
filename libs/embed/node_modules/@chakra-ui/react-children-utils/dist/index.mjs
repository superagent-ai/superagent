// src/index.ts
import { Children, isValidElement } from "react";
function getValidChildren(children) {
  return Children.toArray(children).filter(
    (child) => isValidElement(child)
  );
}
export {
  getValidChildren
};

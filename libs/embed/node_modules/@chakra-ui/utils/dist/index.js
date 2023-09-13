"use strict";
var __create = Object.create;
var __defProp = Object.defineProperty;
var __getOwnPropDesc = Object.getOwnPropertyDescriptor;
var __getOwnPropNames = Object.getOwnPropertyNames;
var __getProtoOf = Object.getPrototypeOf;
var __hasOwnProp = Object.prototype.hasOwnProperty;
var __defNormalProp = (obj, key, value) => key in obj ? __defProp(obj, key, { enumerable: true, configurable: true, writable: true, value }) : obj[key] = value;
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
var __reExport = (target, mod, secondTarget) => (__copyProps(target, mod, "default"), secondTarget && __copyProps(secondTarget, mod, "default"));
var __toESM = (mod, isNodeMode, target) => (target = mod != null ? __create(__getProtoOf(mod)) : {}, __copyProps(
  isNodeMode || !mod || !mod.__esModule ? __defProp(target, "default", { value: mod, enumerable: true }) : target,
  mod
));
var __toCommonJS = (mod) => __copyProps(__defProp({}, "__esModule", { value: true }), mod);
var __publicField = (obj, key, value) => {
  __defNormalProp(obj, typeof key !== "symbol" ? key + "" : key, value);
  return value;
};

// src/index.ts
var src_exports = {};
__export(src_exports, {
  PanSession: () => PanSession,
  __DEV__: () => __DEV__,
  __TEST__: () => __TEST__,
  addDomEvent: () => addDomEvent,
  addItem: () => addItem,
  addPointerEvent: () => addPointerEvent,
  analyzeBreakpoints: () => analyzeBreakpoints,
  ariaAttr: () => ariaAttr,
  arrayToObjectNotation: () => arrayToObjectNotation,
  breakpoints: () => breakpoints,
  callAll: () => callAll,
  callAllHandlers: () => callAllHandlers,
  canUseDOM: () => canUseDOM,
  chunk: () => chunk,
  clampValue: () => clampValue,
  closest: () => closest,
  compose: () => compose,
  contains: () => contains,
  countDecimalPlaces: () => countDecimalPlaces,
  cx: () => cx,
  dataAttr: () => dataAttr,
  detectBrowser: () => detectBrowser,
  detectDeviceType: () => detectDeviceType,
  detectOS: () => detectOS,
  detectTouch: () => detectTouch,
  determineLazyBehavior: () => determineLazyBehavior,
  distance: () => distance,
  error: () => error,
  extractEventInfo: () => extractEventInfo,
  filterUndefined: () => filterUndefined,
  flatten: () => flatten,
  focus: () => focus,
  focusNextTabbable: () => focusNextTabbable,
  focusPreviousTabbable: () => focusPreviousTabbable,
  fromEntries: () => fromEntries,
  get: () => get,
  getActiveElement: () => getActiveElement,
  getAllFocusable: () => getAllFocusable,
  getAllTabbable: () => getAllTabbable,
  getCSSVar: () => getCSSVar,
  getEventWindow: () => getEventWindow,
  getFirstFocusable: () => getFirstFocusable,
  getFirstItem: () => getFirstItem,
  getFirstTabbableIn: () => getFirstTabbableIn,
  getLastItem: () => getLastItem,
  getLastTabbableIn: () => getLastTabbableIn,
  getNextIndex: () => getNextIndex,
  getNextItem: () => getNextItem,
  getNextItemFromSearch: () => getNextItemFromSearch,
  getNextTabbable: () => getNextTabbable,
  getOwnerDocument: () => getOwnerDocument,
  getOwnerWindow: () => getOwnerWindow,
  getPointerEventName: () => getPointerEventName,
  getPrevIndex: () => getPrevIndex,
  getPrevItem: () => getPrevItem,
  getPreviousTabbable: () => getPreviousTabbable,
  getRelatedTarget: () => getRelatedTarget,
  getViewportPointFromEvent: () => getViewportPointFromEvent,
  getWithDefault: () => getWithDefault,
  hasDisplayNone: () => hasDisplayNone,
  hasFocusWithin: () => hasFocusWithin,
  hasNegativeTabIndex: () => hasNegativeTabIndex,
  hasTabIndex: () => hasTabIndex,
  isActiveElement: () => isActiveElement,
  isArray: () => isArray,
  isBrowser: () => isBrowser,
  isContentEditable: () => isContentEditable,
  isCssVar: () => isCssVar,
  isCustomBreakpoint: () => isCustomBreakpoint,
  isDefined: () => isDefined,
  isDisabled: () => isDisabled,
  isElement: () => isElement,
  isEmpty: () => isEmpty,
  isEmptyArray: () => isEmptyArray,
  isEmptyObject: () => isEmptyObject,
  isFocusable: () => isFocusable,
  isFunction: () => isFunction,
  isHTMLElement: () => isHTMLElement,
  isHidden: () => isHidden,
  isInputElement: () => isInputElement,
  isInputEvent: () => isInputEvent,
  isMouseEvent: () => isMouseEvent,
  isMultiTouchEvent: () => isMultiTouchEvent,
  isNotEmptyObject: () => isNotEmptyObject,
  isNotNumber: () => isNotNumber,
  isNull: () => isNull,
  isNumber: () => isNumber,
  isNumeric: () => isNumeric,
  isObject: () => isObject,
  isRefObject: () => isRefObject,
  isResponsiveObjectLike: () => isResponsiveObjectLike,
  isRightClick: () => isRightClick,
  isString: () => isString,
  isTabbable: () => isTabbable,
  isTouchEvent: () => isTouchEvent,
  isUndefined: () => isUndefined,
  mapResponsive: () => mapResponsive,
  maxSafeInteger: () => maxSafeInteger,
  memoize: () => memoize,
  memoizedGet: () => memoizedGet,
  mergeWith: () => import_lodash.default,
  minSafeInteger: () => minSafeInteger,
  noop: () => noop,
  normalizeEventKey: () => normalizeEventKey,
  objectFilter: () => objectFilter,
  objectKeys: () => objectKeys,
  objectToArrayNotation: () => objectToArrayNotation,
  omit: () => omit,
  once: () => once,
  percentToValue: () => percentToValue,
  pick: () => pick,
  pipe: () => pipe,
  px: () => px,
  removeIndex: () => removeIndex,
  removeItem: () => removeItem,
  roundValueToStep: () => roundValueToStep,
  runIfFn: () => runIfFn,
  split: () => split,
  toMediaQueryString: () => toMediaQueryString,
  toPrecision: () => toPrecision,
  valueToPercent: () => valueToPercent,
  walkObject: () => walkObject,
  warn: () => warn,
  wrapPointerEventHandler: () => wrapPointerEventHandler
});
module.exports = __toCommonJS(src_exports);
__reExport(src_exports, require("css-box-model"), module.exports);

// src/array.ts
function getFirstItem(array) {
  return array != null && array.length ? array[0] : void 0;
}
function getLastItem(array) {
  const length = array == null ? 0 : array.length;
  return length ? array[length - 1] : void 0;
}
function getPrevItem(index, array, loop = true) {
  const prevIndex = getPrevIndex(index, array.length, loop);
  return array[prevIndex];
}
function getNextItem(index, array, loop = true) {
  const nextIndex = getNextIndex(index, array.length, 1, loop);
  return array[nextIndex];
}
function removeIndex(array, index) {
  return array.filter((_, idx) => idx !== index);
}
function addItem(array, item) {
  return [...array, item];
}
function removeItem(array, item) {
  return array.filter((eachItem) => eachItem !== item);
}
function getNextIndex(currentIndex, length, step = 1, loop = true) {
  const lastIndex = length - 1;
  if (currentIndex === -1) {
    return step > 0 ? 0 : lastIndex;
  }
  const nextIndex = currentIndex + step;
  if (nextIndex < 0) {
    return loop ? lastIndex : 0;
  }
  if (nextIndex >= length) {
    if (loop)
      return 0;
    return currentIndex > length ? length : currentIndex;
  }
  return nextIndex;
}
function getPrevIndex(index, count, loop = true) {
  return getNextIndex(index, count, -1, loop);
}
function chunk(array, size) {
  return array.reduce((rows, currentValue, index) => {
    if (index % size === 0) {
      rows.push([currentValue]);
    } else {
      rows[rows.length - 1].push(currentValue);
    }
    return rows;
  }, []);
}
function getNextItemFromSearch(items, searchString, itemToString, currentItem) {
  if (searchString == null) {
    return currentItem;
  }
  if (!currentItem) {
    const foundItem = items.find(
      (item) => itemToString(item).toLowerCase().startsWith(searchString.toLowerCase())
    );
    return foundItem;
  }
  const matchingItems = items.filter(
    (item) => itemToString(item).toLowerCase().startsWith(searchString.toLowerCase())
  );
  if (matchingItems.length > 0) {
    let nextIndex;
    if (matchingItems.includes(currentItem)) {
      const currentIndex = matchingItems.indexOf(currentItem);
      nextIndex = currentIndex + 1;
      if (nextIndex === matchingItems.length) {
        nextIndex = 0;
      }
      return matchingItems[nextIndex];
    }
    nextIndex = items.indexOf(matchingItems[0]);
    return items[nextIndex];
  }
  return currentItem;
}

// src/assertion.ts
function isNumber(value) {
  return typeof value === "number";
}
function isNotNumber(value) {
  return typeof value !== "number" || Number.isNaN(value) || !Number.isFinite(value);
}
function isNumeric(value) {
  return value != null && value - parseFloat(value) + 1 >= 0;
}
function isArray(value) {
  return Array.isArray(value);
}
function isEmptyArray(value) {
  return isArray(value) && value.length === 0;
}
function isFunction(value) {
  return typeof value === "function";
}
function isDefined(value) {
  return typeof value !== "undefined" && value !== void 0;
}
function isUndefined(value) {
  return typeof value === "undefined" || value === void 0;
}
function isObject(value) {
  const type = typeof value;
  return value != null && (type === "object" || type === "function") && !isArray(value);
}
function isEmptyObject(value) {
  return isObject(value) && Object.keys(value).length === 0;
}
function isNotEmptyObject(value) {
  return value && !isEmptyObject(value);
}
function isNull(value) {
  return value == null;
}
function isString(value) {
  return Object.prototype.toString.call(value) === "[object String]";
}
function isCssVar(value) {
  return /^var\(--.+\)$/.test(value);
}
function isEmpty(value) {
  if (isArray(value))
    return isEmptyArray(value);
  if (isObject(value))
    return isEmptyObject(value);
  if (value == null || value === "")
    return true;
  return false;
}
var __DEV__ = process.env.NODE_ENV !== "production";
var __TEST__ = process.env.NODE_ENV === "test";
function isRefObject(val) {
  return "current" in val;
}
function isInputEvent(value) {
  return value && isObject(value) && isObject(value.target);
}

// src/object.ts
var import_lodash = __toESM(require("lodash.mergewith"));
function omit(object, keys2) {
  const result = {};
  Object.keys(object).forEach((key) => {
    if (keys2.includes(key))
      return;
    result[key] = object[key];
  });
  return result;
}
function pick(object, keys2) {
  const result = {};
  keys2.forEach((key) => {
    if (key in object) {
      result[key] = object[key];
    }
  });
  return result;
}
function split(object, keys2) {
  const picked = {};
  const omitted = {};
  Object.keys(object).forEach((key) => {
    if (keys2.includes(key)) {
      picked[key] = object[key];
    } else {
      omitted[key] = object[key];
    }
  });
  return [picked, omitted];
}
function get(obj, path, fallback, index) {
  const key = typeof path === "string" ? path.split(".") : [path];
  for (index = 0; index < key.length; index += 1) {
    if (!obj)
      break;
    obj = obj[key[index]];
  }
  return obj === void 0 ? fallback : obj;
}
var memoize = (fn) => {
  const cache = /* @__PURE__ */ new WeakMap();
  const memoizedFn = (obj, path, fallback, index) => {
    if (typeof obj === "undefined") {
      return fn(obj, path, fallback);
    }
    if (!cache.has(obj)) {
      cache.set(obj, /* @__PURE__ */ new Map());
    }
    const map = cache.get(obj);
    if (map.has(path)) {
      return map.get(path);
    }
    const value = fn(obj, path, fallback, index);
    map.set(path, value);
    return value;
  };
  return memoizedFn;
};
var memoizedGet = memoize(get);
function getWithDefault(path, scale) {
  return memoizedGet(scale, path, path);
}
function objectFilter(object, fn) {
  const result = {};
  Object.keys(object).forEach((key) => {
    const value = object[key];
    const shouldPass = fn(value, key, object);
    if (shouldPass) {
      result[key] = value;
    }
  });
  return result;
}
var filterUndefined = (object) => objectFilter(object, (val) => val !== null && val !== void 0);
var objectKeys = (obj) => Object.keys(obj);
var fromEntries = (entries) => entries.reduce((carry, [key, value]) => {
  carry[key] = value;
  return carry;
}, {});
var getCSSVar = (theme, scale, value) => {
  var _a, _b, _c;
  return (_c = (_b = (_a = theme.__cssMap) == null ? void 0 : _a[`${scale}.${value}`]) == null ? void 0 : _b.varRef) != null ? _c : value;
};

// src/breakpoint.ts
function analyzeCSSValue(value) {
  const num = parseFloat(value.toString());
  const unit = value.toString().replace(String(num), "");
  return { unitless: !unit, value: num, unit };
}
function px(value) {
  if (value == null)
    return value;
  const { unitless } = analyzeCSSValue(value);
  return unitless || isNumber(value) ? `${value}px` : value;
}
var sortByBreakpointValue = (a, b) => parseInt(a[1], 10) > parseInt(b[1], 10) ? 1 : -1;
var sortBps = (breakpoints2) => fromEntries(Object.entries(breakpoints2).sort(sortByBreakpointValue));
function normalize(breakpoints2) {
  const sorted = sortBps(breakpoints2);
  return Object.assign(Object.values(sorted), sorted);
}
function keys(breakpoints2) {
  const value = Object.keys(sortBps(breakpoints2));
  return new Set(value);
}
function subtract(value) {
  var _a;
  if (!value)
    return value;
  value = (_a = px(value)) != null ? _a : value;
  const factor = value.endsWith("px") ? -0.02 : -0.01;
  return isNumber(value) ? `${value + factor}` : value.replace(/(\d+\.?\d*)/u, (m) => `${parseFloat(m) + factor}`);
}
function toMediaQueryString(min, max) {
  const query = ["@media screen"];
  if (min)
    query.push("and", `(min-width: ${px(min)})`);
  if (max)
    query.push("and", `(max-width: ${px(max)})`);
  return query.join(" ");
}
function analyzeBreakpoints(breakpoints2) {
  var _a;
  if (!breakpoints2)
    return null;
  breakpoints2.base = (_a = breakpoints2.base) != null ? _a : "0px";
  const normalized = normalize(breakpoints2);
  const queries = Object.entries(breakpoints2).sort(sortByBreakpointValue).map(([breakpoint, minW], index, entry) => {
    var _a2;
    let [, maxW] = (_a2 = entry[index + 1]) != null ? _a2 : [];
    maxW = parseFloat(maxW) > 0 ? subtract(maxW) : void 0;
    return {
      _minW: subtract(minW),
      breakpoint,
      minW,
      maxW,
      maxWQuery: toMediaQueryString(null, maxW),
      minWQuery: toMediaQueryString(minW),
      minMaxQuery: toMediaQueryString(minW, maxW)
    };
  });
  const _keys = keys(breakpoints2);
  const _keysArr = Array.from(_keys.values());
  return {
    keys: _keys,
    normalized,
    isResponsive(test) {
      const keys2 = Object.keys(test);
      return keys2.length > 0 && keys2.every((key) => _keys.has(key));
    },
    asObject: sortBps(breakpoints2),
    asArray: normalize(breakpoints2),
    details: queries,
    media: [
      null,
      ...normalized.map((minW) => toMediaQueryString(minW)).slice(1)
    ],
    toArrayValue(test) {
      if (!isObject(test)) {
        throw new Error("toArrayValue: value must be an object");
      }
      const result = _keysArr.map((bp) => {
        var _a2;
        return (_a2 = test[bp]) != null ? _a2 : null;
      });
      while (getLastItem(result) === null) {
        result.pop();
      }
      return result;
    },
    toObjectValue(test) {
      if (!Array.isArray(test)) {
        throw new Error("toObjectValue: value must be an array");
      }
      return test.reduce((acc, value, index) => {
        const key = _keysArr[index];
        if (key != null && value != null)
          acc[key] = value;
        return acc;
      }, {});
    }
  };
}

// src/dom.ts
function isElement(el) {
  return el != null && typeof el == "object" && "nodeType" in el && el.nodeType === Node.ELEMENT_NODE;
}
function isHTMLElement(el) {
  var _a;
  if (!isElement(el)) {
    return false;
  }
  const win = (_a = el.ownerDocument.defaultView) != null ? _a : window;
  return el instanceof win.HTMLElement;
}
function getOwnerWindow(node) {
  var _a, _b;
  return isElement(node) ? (_b = (_a = getOwnerDocument(node)) == null ? void 0 : _a.defaultView) != null ? _b : window : window;
}
function getOwnerDocument(node) {
  var _a;
  return isElement(node) ? (_a = node.ownerDocument) != null ? _a : document : document;
}
function getEventWindow(event) {
  var _a;
  return (_a = event.view) != null ? _a : window;
}
function canUseDOM() {
  return !!(typeof window !== "undefined" && window.document && window.document.createElement);
}
var isBrowser = /* @__PURE__ */ canUseDOM();
var dataAttr = (condition) => condition ? "" : void 0;
var ariaAttr = (condition) => condition ? true : void 0;
var cx = (...classNames) => classNames.filter(Boolean).join(" ");
function getActiveElement(node) {
  const doc = getOwnerDocument(node);
  return doc == null ? void 0 : doc.activeElement;
}
function contains(parent, child) {
  if (!parent)
    return false;
  return parent === child || parent.contains(child);
}
function addDomEvent(target, eventName, handler, options) {
  target.addEventListener(eventName, handler, options);
  return () => {
    target.removeEventListener(eventName, handler, options);
  };
}
function normalizeEventKey(event) {
  const { key, keyCode } = event;
  const isArrowKey = keyCode >= 37 && keyCode <= 40 && key.indexOf("Arrow") !== 0;
  const eventKey = isArrowKey ? `Arrow${key}` : key;
  return eventKey;
}
function getRelatedTarget(event) {
  var _a, _b;
  const target = (_a = event.target) != null ? _a : event.currentTarget;
  const activeElement = getActiveElement(target);
  return (_b = event.relatedTarget) != null ? _b : activeElement;
}
function isRightClick(event) {
  return event.button !== 0;
}

// src/tabbable.ts
var hasDisplayNone = (element) => window.getComputedStyle(element).display === "none";
var hasTabIndex = (element) => element.hasAttribute("tabindex");
var hasNegativeTabIndex = (element) => hasTabIndex(element) && element.tabIndex === -1;
function isDisabled(element) {
  return Boolean(element.getAttribute("disabled")) === true || Boolean(element.getAttribute("aria-disabled")) === true;
}
function isInputElement(element) {
  return isHTMLElement(element) && element.localName === "input" && "select" in element;
}
function isActiveElement(element) {
  const doc = isHTMLElement(element) ? getOwnerDocument(element) : document;
  return doc.activeElement === element;
}
function hasFocusWithin(element) {
  if (!document.activeElement)
    return false;
  return element.contains(document.activeElement);
}
function isHidden(element) {
  if (element.parentElement && isHidden(element.parentElement))
    return true;
  return element.hidden;
}
function isContentEditable(element) {
  const value = element.getAttribute("contenteditable");
  return value !== "false" && value != null;
}
function isFocusable(element) {
  if (!isHTMLElement(element) || isHidden(element) || isDisabled(element)) {
    return false;
  }
  const { localName } = element;
  const focusableTags = ["input", "select", "textarea", "button"];
  if (focusableTags.indexOf(localName) >= 0)
    return true;
  const others = {
    a: () => element.hasAttribute("href"),
    audio: () => element.hasAttribute("controls"),
    video: () => element.hasAttribute("controls")
  };
  if (localName in others) {
    return others[localName]();
  }
  if (isContentEditable(element))
    return true;
  return hasTabIndex(element);
}
function isTabbable(element) {
  if (!element)
    return false;
  return isHTMLElement(element) && isFocusable(element) && !hasNegativeTabIndex(element);
}

// src/dom-query.ts
var focusableElList = [
  "input:not(:disabled):not([disabled])",
  "select:not(:disabled):not([disabled])",
  "textarea:not(:disabled):not([disabled])",
  "embed",
  "iframe",
  "object",
  "a[href]",
  "area[href]",
  "button:not(:disabled):not([disabled])",
  "[tabindex]",
  "audio[controls]",
  "video[controls]",
  "*[tabindex]:not([aria-disabled])",
  "*[contenteditable]"
];
var focusableElSelector = focusableElList.join();
var isVisible = (el) => el.offsetWidth > 0 && el.offsetHeight > 0;
function getAllFocusable(container) {
  const focusableEls = Array.from(
    container.querySelectorAll(focusableElSelector)
  );
  focusableEls.unshift(container);
  return focusableEls.filter((el) => isFocusable(el) && isVisible(el));
}
function getFirstFocusable(container) {
  const allFocusable = getAllFocusable(container);
  return allFocusable.length ? allFocusable[0] : null;
}
function getAllTabbable(container, fallbackToFocusable) {
  const allFocusable = Array.from(
    container.querySelectorAll(focusableElSelector)
  );
  const allTabbable = allFocusable.filter(isTabbable);
  if (isTabbable(container)) {
    allTabbable.unshift(container);
  }
  if (!allTabbable.length && fallbackToFocusable) {
    return allFocusable;
  }
  return allTabbable;
}
function getFirstTabbableIn(container, fallbackToFocusable) {
  const [first] = getAllTabbable(container, fallbackToFocusable);
  return first || null;
}
function getLastTabbableIn(container, fallbackToFocusable) {
  const allTabbable = getAllTabbable(container, fallbackToFocusable);
  return allTabbable[allTabbable.length - 1] || null;
}
function getNextTabbable(container, fallbackToFocusable) {
  const allFocusable = getAllFocusable(container);
  const index = allFocusable.indexOf(document.activeElement);
  const slice = allFocusable.slice(index + 1);
  return slice.find(isTabbable) || allFocusable.find(isTabbable) || (fallbackToFocusable ? slice[0] : null);
}
function getPreviousTabbable(container, fallbackToFocusable) {
  const allFocusable = getAllFocusable(container).reverse();
  const index = allFocusable.indexOf(document.activeElement);
  const slice = allFocusable.slice(index + 1);
  return slice.find(isTabbable) || allFocusable.find(isTabbable) || (fallbackToFocusable ? slice[0] : null);
}
function focusNextTabbable(container, fallbackToFocusable) {
  const nextTabbable = getNextTabbable(container, fallbackToFocusable);
  if (nextTabbable && isHTMLElement(nextTabbable)) {
    nextTabbable.focus();
  }
}
function focusPreviousTabbable(container, fallbackToFocusable) {
  const previousTabbable = getPreviousTabbable(container, fallbackToFocusable);
  if (previousTabbable && isHTMLElement(previousTabbable)) {
    previousTabbable.focus();
  }
}
function matches(element, selectors) {
  if ("matches" in element)
    return element.matches(selectors);
  if ("msMatchesSelector" in element)
    return element.msMatchesSelector(selectors);
  return element.webkitMatchesSelector(selectors);
}
function closest(element, selectors) {
  if ("closest" in element)
    return element.closest(selectors);
  do {
    if (matches(element, selectors))
      return element;
    element = element.parentElement || element.parentNode;
  } while (element !== null && element.nodeType === 1);
  return null;
}

// src/function.ts
function runIfFn(valueOrFn, ...args) {
  return isFunction(valueOrFn) ? valueOrFn(...args) : valueOrFn;
}
function callAllHandlers(...fns) {
  return function func(event) {
    fns.some((fn) => {
      fn == null ? void 0 : fn(event);
      return event == null ? void 0 : event.defaultPrevented;
    });
  };
}
function callAll(...fns) {
  return function mergedFn(arg) {
    fns.forEach((fn) => {
      fn == null ? void 0 : fn(arg);
    });
  };
}
var compose = (fn1, ...fns) => fns.reduce(
  (f1, f2) => (...args) => f1(f2(...args)),
  fn1
);
function once(fn) {
  let result;
  return function func(...args) {
    if (fn) {
      result = fn.apply(this, args);
      fn = null;
    }
    return result;
  };
}
var noop = () => {
};
var warn = /* @__PURE__ */ once((options) => () => {
  const { condition, message } = options;
  if (condition && __DEV__) {
    console.warn(message);
  }
});
var error = /* @__PURE__ */ once((options) => () => {
  const { condition, message } = options;
  if (condition && __DEV__) {
    console.error(message);
  }
});
var pipe = (...fns) => (v) => fns.reduce((a, b) => b(a), v);
var distance1D = (a, b) => Math.abs(a - b);
var isPoint = (point) => "x" in point && "y" in point;
function distance(a, b) {
  if (isNumber(a) && isNumber(b)) {
    return distance1D(a, b);
  }
  if (isPoint(a) && isPoint(b)) {
    const xDelta = distance1D(a.x, b.x);
    const yDelta = distance1D(a.y, b.y);
    return Math.sqrt(xDelta ** 2 + yDelta ** 2);
  }
  return 0;
}

// src/focus.ts
function focus(element, options = {}) {
  const {
    isActive = isActiveElement,
    nextTick,
    preventScroll = true,
    selectTextIfInput = true
  } = options;
  if (!element || isActive(element))
    return -1;
  function triggerFocus() {
    if (!element) {
      warn({
        condition: true,
        message: "[chakra-ui]: can't call focus() on `null` or `undefined` element"
      });
      return;
    }
    if (supportsPreventScroll()) {
      element.focus({ preventScroll });
    } else {
      element.focus();
      if (preventScroll) {
        const scrollableElements = getScrollableElements(element);
        restoreScrollPosition(scrollableElements);
      }
    }
    if (selectTextIfInput) {
      if (isInputElement(element)) {
        element.select();
      } else if ("setSelectionRange" in element) {
        const el = element;
        el.setSelectionRange(el.value.length, el.value.length);
      }
    }
  }
  if (nextTick) {
    return requestAnimationFrame(triggerFocus);
  }
  triggerFocus();
  return -1;
}
var supportsPreventScrollCached = null;
function supportsPreventScroll() {
  if (supportsPreventScrollCached == null) {
    supportsPreventScrollCached = false;
    try {
      const div = document.createElement("div");
      div.focus({
        get preventScroll() {
          supportsPreventScrollCached = true;
          return true;
        }
      });
    } catch (e) {
    }
  }
  return supportsPreventScrollCached;
}
function getScrollableElements(element) {
  var _a;
  const doc = getOwnerDocument(element);
  const win = (_a = doc.defaultView) != null ? _a : window;
  let parent = element.parentNode;
  const scrollableElements = [];
  const rootScrollingElement = doc.scrollingElement || doc.documentElement;
  while (parent instanceof win.HTMLElement && parent !== rootScrollingElement) {
    if (parent.offsetHeight < parent.scrollHeight || parent.offsetWidth < parent.scrollWidth) {
      scrollableElements.push({
        element: parent,
        scrollTop: parent.scrollTop,
        scrollLeft: parent.scrollLeft
      });
    }
    parent = parent.parentNode;
  }
  if (rootScrollingElement instanceof win.HTMLElement) {
    scrollableElements.push({
      element: rootScrollingElement,
      scrollTop: rootScrollingElement.scrollTop,
      scrollLeft: rootScrollingElement.scrollLeft
    });
  }
  return scrollableElements;
}
function restoreScrollPosition(scrollableElements) {
  for (const { element, scrollTop, scrollLeft } of scrollableElements) {
    element.scrollTop = scrollTop;
    element.scrollLeft = scrollLeft;
  }
}

// src/flatten.ts
function flatten(target, maxDepth = Infinity) {
  if (!isObject(target) && !Array.isArray(target) || !maxDepth) {
    return target;
  }
  return Object.entries(target).reduce((result, [key, value]) => {
    if (isObject(value) || isArray(value)) {
      Object.entries(flatten(value, maxDepth - 1)).forEach(
        ([childKey, childValue]) => {
          result[`${key}.${childKey}`] = childValue;
        }
      );
    } else {
      result[key] = value;
    }
    return result;
  }, {});
}

// src/lazy.ts
function determineLazyBehavior(options) {
  const {
    hasBeenSelected,
    isLazy,
    isSelected,
    lazyBehavior = "unmount"
  } = options;
  if (!isLazy)
    return true;
  if (isSelected)
    return true;
  if (lazyBehavior === "keepMounted" && hasBeenSelected)
    return true;
  return false;
}

// src/number.ts
var minSafeInteger = Number.MIN_SAFE_INTEGER || -9007199254740991;
var maxSafeInteger = Number.MAX_SAFE_INTEGER || 9007199254740991;
function toNumber(value) {
  const num = parseFloat(value);
  return isNotNumber(num) ? 0 : num;
}
function toPrecision(value, precision) {
  let nextValue = toNumber(value);
  const scaleFactor = 10 ** (precision != null ? precision : 10);
  nextValue = Math.round(nextValue * scaleFactor) / scaleFactor;
  return precision ? nextValue.toFixed(precision) : nextValue.toString();
}
function countDecimalPlaces(value) {
  if (!Number.isFinite(value))
    return 0;
  let e = 1;
  let p = 0;
  while (Math.round(value * e) / e !== value) {
    e *= 10;
    p += 1;
  }
  return p;
}
function valueToPercent(value, min, max) {
  return (value - min) * 100 / (max - min);
}
function percentToValue(percent, min, max) {
  return (max - min) * percent + min;
}
function roundValueToStep(value, from, step) {
  const nextValue = Math.round((value - from) / step) * step + from;
  const precision = countDecimalPlaces(step);
  return toPrecision(nextValue, precision);
}
function clampValue(value, min, max) {
  if (value == null)
    return value;
  warn({
    condition: max < min,
    message: "clamp: max cannot be less than min"
  });
  return Math.min(Math.max(value, min), max);
}

// src/pan-event.ts
var import_framesync = __toESM(require("framesync"));

// src/pointer-event.ts
function isMouseEvent(event) {
  const win = getEventWindow(event);
  if (typeof win.PointerEvent !== "undefined" && event instanceof win.PointerEvent) {
    return !!(event.pointerType === "mouse");
  }
  return event instanceof win.MouseEvent;
}
function isTouchEvent(event) {
  const hasTouches = !!event.touches;
  return hasTouches;
}
function filterPrimaryPointer(eventHandler) {
  return (event) => {
    const win = getEventWindow(event);
    const isMouseEvent2 = event instanceof win.MouseEvent;
    const isPrimaryPointer = !isMouseEvent2 || isMouseEvent2 && event.button === 0;
    if (isPrimaryPointer) {
      eventHandler(event);
    }
  };
}
var defaultPagePoint = { pageX: 0, pageY: 0 };
function pointFromTouch(e, pointType = "page") {
  const primaryTouch = e.touches[0] || e.changedTouches[0];
  const point = primaryTouch || defaultPagePoint;
  return {
    x: point[`${pointType}X`],
    y: point[`${pointType}Y`]
  };
}
function pointFromMouse(point, pointType = "page") {
  return {
    x: point[`${pointType}X`],
    y: point[`${pointType}Y`]
  };
}
function extractEventInfo(event, pointType = "page") {
  return {
    point: isTouchEvent(event) ? pointFromTouch(event, pointType) : pointFromMouse(event, pointType)
  };
}
function getViewportPointFromEvent(event) {
  return extractEventInfo(event, "client");
}
var wrapPointerEventHandler = (handler, shouldFilterPrimaryPointer = false) => {
  const listener = (event) => handler(event, extractEventInfo(event));
  return shouldFilterPrimaryPointer ? filterPrimaryPointer(listener) : listener;
};
var supportsPointerEvents = () => isBrowser && window.onpointerdown === null;
var supportsTouchEvents = () => isBrowser && window.ontouchstart === null;
var supportsMouseEvents = () => isBrowser && window.onmousedown === null;
var mouseEventNames = {
  pointerdown: "mousedown",
  pointermove: "mousemove",
  pointerup: "mouseup",
  pointercancel: "mousecancel",
  pointerover: "mouseover",
  pointerout: "mouseout",
  pointerenter: "mouseenter",
  pointerleave: "mouseleave"
};
var touchEventNames = {
  pointerdown: "touchstart",
  pointermove: "touchmove",
  pointerup: "touchend",
  pointercancel: "touchcancel"
};
function getPointerEventName(name) {
  if (supportsPointerEvents()) {
    return name;
  }
  if (supportsTouchEvents()) {
    return touchEventNames[name];
  }
  if (supportsMouseEvents()) {
    return mouseEventNames[name];
  }
  return name;
}
function addPointerEvent(target, eventName, handler, options) {
  return addDomEvent(
    target,
    getPointerEventName(eventName),
    wrapPointerEventHandler(handler, eventName === "pointerdown"),
    options
  );
}
function isMultiTouchEvent(event) {
  return isTouchEvent(event) && event.touches.length > 1;
}

// src/pan-event.ts
var PanSession = class {
  constructor(event, handlers, threshold) {
    __publicField(this, "history", []);
    __publicField(this, "startEvent", null);
    __publicField(this, "lastEvent", null);
    __publicField(this, "lastEventInfo", null);
    __publicField(this, "handlers", {});
    __publicField(this, "removeListeners", noop);
    __publicField(this, "threshold", 3);
    __publicField(this, "win");
    __publicField(this, "updatePoint", () => {
      if (!(this.lastEvent && this.lastEventInfo))
        return;
      const info = getPanInfo(this.lastEventInfo, this.history);
      const isPanStarted = this.startEvent !== null;
      const isDistancePastThreshold = distance(info.offset, { x: 0, y: 0 }) >= this.threshold;
      if (!isPanStarted && !isDistancePastThreshold)
        return;
      const { timestamp } = (0, import_framesync.getFrameData)();
      this.history.push({ ...info.point, timestamp });
      const { onStart, onMove } = this.handlers;
      if (!isPanStarted) {
        onStart == null ? void 0 : onStart(this.lastEvent, info);
        this.startEvent = this.lastEvent;
      }
      onMove == null ? void 0 : onMove(this.lastEvent, info);
    });
    __publicField(this, "onPointerMove", (event, info) => {
      this.lastEvent = event;
      this.lastEventInfo = info;
      if (isMouseEvent(event) && event.buttons === 0) {
        this.onPointerUp(event, info);
        return;
      }
      import_framesync.default.update(this.updatePoint, true);
    });
    __publicField(this, "onPointerUp", (event, info) => {
      const panInfo = getPanInfo(info, this.history);
      const { onEnd, onSessionEnd } = this.handlers;
      onSessionEnd == null ? void 0 : onSessionEnd(event, panInfo);
      this.end();
      if (!onEnd || !this.startEvent)
        return;
      onEnd == null ? void 0 : onEnd(event, panInfo);
    });
    this.win = getEventWindow(event);
    if (isMultiTouchEvent(event))
      return;
    this.handlers = handlers;
    if (threshold) {
      this.threshold = threshold;
    }
    event.stopPropagation();
    event.preventDefault();
    const info = extractEventInfo(event);
    const { timestamp } = (0, import_framesync.getFrameData)();
    this.history = [{ ...info.point, timestamp }];
    const { onSessionStart } = handlers;
    onSessionStart == null ? void 0 : onSessionStart(event, getPanInfo(info, this.history));
    this.removeListeners = pipe(
      addPointerEvent(this.win, "pointermove", this.onPointerMove),
      addPointerEvent(this.win, "pointerup", this.onPointerUp),
      addPointerEvent(this.win, "pointercancel", this.onPointerUp)
    );
  }
  updateHandlers(handlers) {
    this.handlers = handlers;
  }
  end() {
    var _a;
    (_a = this.removeListeners) == null ? void 0 : _a.call(this);
    import_framesync.cancelSync.update(this.updatePoint);
  }
};
function subtractPoint(a, b) {
  return { x: a.x - b.x, y: a.y - b.y };
}
function startPanPoint(history) {
  return history[0];
}
function lastPanPoint(history) {
  return history[history.length - 1];
}
function getPanInfo(info, history) {
  return {
    point: info.point,
    delta: subtractPoint(info.point, lastPanPoint(history)),
    offset: subtractPoint(info.point, startPanPoint(history)),
    velocity: getVelocity(history, 0.1)
  };
}
function lastDevicePoint(history) {
  return history[history.length - 1];
}
var toMilliseconds = (seconds) => seconds * 1e3;
function getVelocity(history, timeDelta) {
  if (history.length < 2) {
    return { x: 0, y: 0 };
  }
  let i = history.length - 1;
  let timestampedPoint = null;
  const lastPoint = lastDevicePoint(history);
  while (i >= 0) {
    timestampedPoint = history[i];
    if (lastPoint.timestamp - timestampedPoint.timestamp > toMilliseconds(timeDelta)) {
      break;
    }
    i--;
  }
  if (!timestampedPoint) {
    return { x: 0, y: 0 };
  }
  const time = (lastPoint.timestamp - timestampedPoint.timestamp) / 1e3;
  if (time === 0) {
    return { x: 0, y: 0 };
  }
  const currentVelocity = {
    x: (lastPoint.x - timestampedPoint.x) / time,
    y: (lastPoint.y - timestampedPoint.y) / time
  };
  if (currentVelocity.x === Infinity) {
    currentVelocity.x = 0;
  }
  if (currentVelocity.y === Infinity) {
    currentVelocity.y = 0;
  }
  return currentVelocity;
}

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
  const keys2 = Object.keys(obj);
  return keys2.length > 0 && keys2.every((key) => bps.includes(key));
}
var isCustomBreakpoint = (maybeBreakpoint) => Number.isNaN(Number(maybeBreakpoint));

// src/user-agent.ts
function getUserAgentBrowser(navigator) {
  const { userAgent: ua, vendor } = navigator;
  const android = /(android)/i.test(ua);
  switch (true) {
    case /CriOS/.test(ua):
      return "Chrome for iOS";
    case /Edg\//.test(ua):
      return "Edge";
    case (android && /Silk\//.test(ua)):
      return "Silk";
    case (/Chrome/.test(ua) && /Google Inc/.test(vendor)):
      return "Chrome";
    case /Firefox\/\d+\.\d+$/.test(ua):
      return "Firefox";
    case android:
      return "AOSP";
    case /MSIE|Trident/.test(ua):
      return "IE";
    case (/Safari/.test(navigator.userAgent) && /Apple Computer/.test(ua)):
      return "Safari";
    case /AppleWebKit/.test(ua):
      return "WebKit";
    default:
      return null;
  }
}
function getUserAgentOS(navigator) {
  const { userAgent: ua, platform } = navigator;
  switch (true) {
    case /Android/.test(ua):
      return "Android";
    case /iPhone|iPad|iPod/.test(platform):
      return "iOS";
    case /Win/.test(platform):
      return "Windows";
    case /Mac/.test(platform):
      return "Mac";
    case /CrOS/.test(ua):
      return "Chrome OS";
    case /Firefox/.test(ua):
      return "Firefox OS";
    default:
      return null;
  }
}
function detectDeviceType(navigator) {
  const { userAgent: ua } = navigator;
  if (/(tablet)|(iPad)|(Nexus 9)/i.test(ua))
    return "tablet";
  if (/(mobi)/i.test(ua))
    return "phone";
  return "desktop";
}
function detectOS(os) {
  if (!isBrowser)
    return false;
  return getUserAgentOS(window.navigator) === os;
}
function detectBrowser(browser) {
  if (!isBrowser)
    return false;
  return getUserAgentBrowser(window.navigator) === browser;
}
function detectTouch() {
  if (!isBrowser)
    return false;
  return window.ontouchstart === null && window.ontouchmove === null && window.ontouchend === null;
}

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
// Annotate the CommonJS export names for ESM import in node:
0 && (module.exports = {
  PanSession,
  __DEV__,
  __TEST__,
  addDomEvent,
  addItem,
  addPointerEvent,
  analyzeBreakpoints,
  ariaAttr,
  arrayToObjectNotation,
  breakpoints,
  callAll,
  callAllHandlers,
  canUseDOM,
  chunk,
  clampValue,
  closest,
  compose,
  contains,
  countDecimalPlaces,
  cx,
  dataAttr,
  detectBrowser,
  detectDeviceType,
  detectOS,
  detectTouch,
  determineLazyBehavior,
  distance,
  error,
  extractEventInfo,
  filterUndefined,
  flatten,
  focus,
  focusNextTabbable,
  focusPreviousTabbable,
  fromEntries,
  get,
  getActiveElement,
  getAllFocusable,
  getAllTabbable,
  getCSSVar,
  getEventWindow,
  getFirstFocusable,
  getFirstItem,
  getFirstTabbableIn,
  getLastItem,
  getLastTabbableIn,
  getNextIndex,
  getNextItem,
  getNextItemFromSearch,
  getNextTabbable,
  getOwnerDocument,
  getOwnerWindow,
  getPointerEventName,
  getPrevIndex,
  getPrevItem,
  getPreviousTabbable,
  getRelatedTarget,
  getViewportPointFromEvent,
  getWithDefault,
  hasDisplayNone,
  hasFocusWithin,
  hasNegativeTabIndex,
  hasTabIndex,
  isActiveElement,
  isArray,
  isBrowser,
  isContentEditable,
  isCssVar,
  isCustomBreakpoint,
  isDefined,
  isDisabled,
  isElement,
  isEmpty,
  isEmptyArray,
  isEmptyObject,
  isFocusable,
  isFunction,
  isHTMLElement,
  isHidden,
  isInputElement,
  isInputEvent,
  isMouseEvent,
  isMultiTouchEvent,
  isNotEmptyObject,
  isNotNumber,
  isNull,
  isNumber,
  isNumeric,
  isObject,
  isRefObject,
  isResponsiveObjectLike,
  isRightClick,
  isString,
  isTabbable,
  isTouchEvent,
  isUndefined,
  mapResponsive,
  maxSafeInteger,
  memoize,
  memoizedGet,
  mergeWith,
  minSafeInteger,
  noop,
  normalizeEventKey,
  objectFilter,
  objectKeys,
  objectToArrayNotation,
  omit,
  once,
  percentToValue,
  pick,
  pipe,
  px,
  removeIndex,
  removeItem,
  roundValueToStep,
  runIfFn,
  split,
  toMediaQueryString,
  toPrecision,
  valueToPercent,
  walkObject,
  warn,
  wrapPointerEventHandler
});

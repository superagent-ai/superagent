"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.FOCUS_NO_AUTOFOCUS = exports.FOCUS_AUTO = exports.FOCUS_ALLOW = exports.FOCUS_DISABLED = exports.FOCUS_GROUP = void 0;
/**
 * defines a focus group
 */
exports.FOCUS_GROUP = 'data-focus-lock';
/**
 * disables element discovery inside a group marked by key
 */
exports.FOCUS_DISABLED = 'data-focus-lock-disabled';
/**
 * allows uncontrolled focus within the marked area, effectively disabling focus lock for it's content
 */
exports.FOCUS_ALLOW = 'data-no-focus-lock';
/**
 * instructs autofocus engine to pick default autofocus inside a given node
 * can be set on the element or container
 */
exports.FOCUS_AUTO = 'data-autofocus-inside';
/**
 * instructs autofocus to ignore elements within a given node
 * can be set on the element or container
 */
exports.FOCUS_NO_AUTOFOCUS = 'data-no-autofocus';

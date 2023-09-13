"use strict";

var _interopRequireWildcard = require("@babel/runtime/helpers/interopRequireWildcard");

var _interopRequireDefault = require("@babel/runtime/helpers/interopRequireDefault");

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports["default"] = void 0;

var _extends2 = _interopRequireDefault(require("@babel/runtime/helpers/extends"));

var React = _interopRequireWildcard(require("react"));

var _propTypes = _interopRequireDefault(require("prop-types"));

var constants = _interopRequireWildcard(require("focus-lock/constants"));

var _util = require("./util");

/* eslint-disable react/require-default-props */
var AutoFocusInside = function AutoFocusInside(_ref) {
  var _ref$disabled = _ref.disabled,
      disabled = _ref$disabled === void 0 ? false : _ref$disabled,
      children = _ref.children,
      _ref$className = _ref.className,
      className = _ref$className === void 0 ? undefined : _ref$className;
  return /*#__PURE__*/React.createElement("div", (0, _extends2["default"])({}, (0, _util.inlineProp)(constants.FOCUS_AUTO, !disabled), {
    className: className
  }), children);
};

AutoFocusInside.propTypes = process.env.NODE_ENV !== "production" ? {
  children: _propTypes["default"].node.isRequired,
  disabled: _propTypes["default"].bool,
  className: _propTypes["default"].string
} : {};
var _default = AutoFocusInside;
exports["default"] = _default;
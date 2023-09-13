import _extends from "@babel/runtime/helpers/esm/extends";

/* eslint-disable react/require-default-props */
import * as React from 'react';
import PropTypes from 'prop-types';
import * as constants from 'focus-lock/constants';
import { inlineProp } from './util';

var AutoFocusInside = function AutoFocusInside(_ref) {
  var _ref$disabled = _ref.disabled,
      disabled = _ref$disabled === void 0 ? false : _ref$disabled,
      children = _ref.children,
      _ref$className = _ref.className,
      className = _ref$className === void 0 ? undefined : _ref$className;
  return /*#__PURE__*/React.createElement("div", _extends({}, inlineProp(constants.FOCUS_AUTO, !disabled), {
    className: className
  }), children);
};

AutoFocusInside.propTypes = process.env.NODE_ENV !== "production" ? {
  children: PropTypes.node.isRequired,
  disabled: PropTypes.bool,
  className: PropTypes.string
} : {};
export default AutoFocusInside;
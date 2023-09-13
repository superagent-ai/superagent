"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var tslib_1 = require("tslib");
var react_1 = require("react");
var isReact16Plus = parseInt(react_1.version.substr(0, react_1.version.indexOf('.'))) > 15;
var isFn = function (fn) { return typeof fn === 'function'; };
var render = function (props, data) {
    var more = [];
    for (var _i = 2; _i < arguments.length; _i++) {
        more[_i - 2] = arguments[_i];
    }
    if (process.env.NODE_ENV !== 'production') {
        if (typeof props !== 'object') {
            throw new TypeError('renderChildren(props, data) first argument must be a props object.');
        }
        var children_1 = props.children, render_1 = props.render;
        if (isFn(children_1) && isFn(render_1)) {
            console.warn('Both "render" and "children" are specified for in a universal interface component. ' +
                'Children will be used.');
            console.trace();
        }
        if (typeof data !== 'object') {
            console.warn('Universal component interface normally expects data to be an object, ' +
                ("\"" + typeof data + "\" received."));
            console.trace();
        }
    }
    var render = props.render, _a = props.children, children = _a === void 0 ? render : _a, component = props.component, _b = props.comp, comp = _b === void 0 ? component : _b;
    if (isFn(children))
        return children.apply(void 0, tslib_1.__spreadArrays([data], more));
    if (comp) {
        return react_1.createElement(comp, data);
    }
    if (children instanceof Array)
        return isReact16Plus ? children : react_1.createElement.apply(void 0, tslib_1.__spreadArrays(['div', null], children));
    if (children && (children instanceof Object)) {
        if (process.env.NODE_ENV !== 'production') {
            if (!children.type || ((typeof children.type !== 'string') && (typeof children.type !== 'function') && (typeof children.type !== 'symbol'))) {
                console.warn('Universal component interface received object as children, ' +
                    'expected React element, but received unexpected React "type".');
                console.trace();
            }
            if (typeof children.type === 'string')
                return children;
            return react_1.cloneElement(children, Object.assign({}, children.props, data));
        }
        else {
            if (typeof children.type === 'string')
                return children;
            return react_1.cloneElement(children, Object.assign({}, children.props, data));
        }
    }
    return children || null;
};
exports.default = render;
//# sourceMappingURL=render.js.map
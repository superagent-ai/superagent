"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var tslib_1 = require("tslib");
var react_1 = tslib_1.__importDefault(require("react"));
var createRouter = function () {
    var context = react_1.default.createContext({
        route: '',
    });
    // not sure if this supposed to be unused, ignoring ts error for now
    // @ts-ignore
    var Router = function (props) {
        var route = props.route, fullRoute = props.fullRoute, parent = props.parent, children = props.children;
        if (process.env.NODE_ENV !== 'production') {
            if (typeof route !== 'string') {
                throw new TypeError('Router route must be a string.');
            }
        }
        return react_1.default.createElement(context.Provider, {
            value: {
                fullRoute: fullRoute || route,
                route: route,
                parent: parent,
            },
            children: children,
        });
    };
};
exports.default = createRouter;

"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var react_1 = require("react");
var util_1 = require("./misc/util");
var useIsomorphicLayoutEffect = util_1.isBrowser ? react_1.useLayoutEffect : react_1.useEffect;
exports.default = useIsomorphicLayoutEffect;

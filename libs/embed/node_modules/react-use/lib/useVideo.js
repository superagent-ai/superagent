"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var tslib_1 = require("tslib");
var createHTMLMediaHook_1 = tslib_1.__importDefault(require("./factory/createHTMLMediaHook"));
var useVideo = createHTMLMediaHook_1.default('video');
exports.default = useVideo;

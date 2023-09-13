'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});

var _crossFade = require('inline-style-prefixer/lib/plugins/crossFade');

var _crossFade2 = _interopRequireDefault(_crossFade);

var _gradient = require('inline-style-prefixer/lib/plugins/gradient');

var _gradient2 = _interopRequireDefault(_gradient);

var _imageSet = require('inline-style-prefixer/lib/plugins/imageSet');

var _imageSet2 = _interopRequireDefault(_imageSet);

var _sizing = require('inline-style-prefixer/lib/plugins/sizing');

var _sizing2 = _interopRequireDefault(_sizing);

var _transition = require('inline-style-prefixer/lib/plugins/transition');

var _transition2 = _interopRequireDefault(_transition);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

var w = ["Webkit"];
var m = ["Moz"];
var ms = ["ms"];
var wm = ["Webkit", "Moz"];
var wms = ["Webkit", "ms"];
var wmms = ["Webkit", "Moz", "ms"];

exports.default = {
  plugins: [_crossFade2.default, _gradient2.default, _imageSet2.default, _sizing2.default, _transition2.default],
  prefixMap: { "appearance": wmms, "textEmphasisPosition": wms, "textEmphasis": wms, "textEmphasisStyle": wms, "textEmphasisColor": wms, "boxDecorationBreak": wms, "maskImage": wms, "maskMode": wms, "maskRepeat": wms, "maskPosition": wms, "maskClip": wms, "maskOrigin": wms, "maskSize": wms, "maskComposite": wms, "mask": wms, "maskBorderSource": wms, "maskBorderMode": wms, "maskBorderSlice": wms, "maskBorderWidth": wms, "maskBorderOutset": wms, "maskBorderRepeat": wms, "maskBorder": wms, "maskType": wms, "userSelect": wms, "backdropFilter": w, "clipPath": w, "hyphens": wms, "textOrientation": w, "tabSize": m, "wrapFlow": ms, "wrapThrough": ms, "wrapMargin": ms, "scrollSnapType": ms, "scrollSnapPointsX": ms, "scrollSnapPointsY": ms, "scrollSnapDestination": ms, "scrollSnapCoordinate": ms, "textSizeAdjust": ["ms", "Webkit"], "flowInto": ms, "flowFrom": ms, "breakBefore": ms, "breakAfter": ms, "breakInside": ms, "regionFragment": ms, "fontKerning": w, "textDecorationStyle": w, "textDecorationSkip": w, "textDecorationLine": w, "textDecorationColor": w }
};
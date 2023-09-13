import crossFade from 'inline-style-prefixer/lib/plugins/crossFade';
import gradient from 'inline-style-prefixer/lib/plugins/gradient';
import imageSet from 'inline-style-prefixer/lib/plugins/imageSet';
import sizing from 'inline-style-prefixer/lib/plugins/sizing';
import transition from 'inline-style-prefixer/lib/plugins/transition';
var w = ["Webkit"];
var m = ["Moz"];
var ms = ["ms"];
var wm = ["Webkit", "Moz"];
var wms = ["Webkit", "ms"];
var wmms = ["Webkit", "Moz", "ms"];

export default {
  plugins: [crossFade, gradient, imageSet, sizing, transition],
  prefixMap: { "appearance": wmms, "textEmphasisPosition": wms, "textEmphasis": wms, "textEmphasisStyle": wms, "textEmphasisColor": wms, "boxDecorationBreak": wms, "maskImage": wms, "maskMode": wms, "maskRepeat": wms, "maskPosition": wms, "maskClip": wms, "maskOrigin": wms, "maskSize": wms, "maskComposite": wms, "mask": wms, "maskBorderSource": wms, "maskBorderMode": wms, "maskBorderSlice": wms, "maskBorderWidth": wms, "maskBorderOutset": wms, "maskBorderRepeat": wms, "maskBorder": wms, "maskType": wms, "userSelect": wms, "backdropFilter": w, "clipPath": w, "hyphens": wms, "textOrientation": w, "tabSize": m, "wrapFlow": ms, "wrapThrough": ms, "wrapMargin": ms, "scrollSnapType": ms, "scrollSnapPointsX": ms, "scrollSnapPointsY": ms, "scrollSnapDestination": ms, "scrollSnapCoordinate": ms, "textSizeAdjust": ["ms", "Webkit"], "flowInto": ms, "flowFrom": ms, "breakBefore": ms, "breakAfter": ms, "breakInside": ms, "regionFragment": ms, "fontKerning": w, "textDecorationStyle": w, "textDecorationSkip": w, "textDecorationLine": w, "textDecorationColor": w }
};
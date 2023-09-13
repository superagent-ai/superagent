import { createMedium, createSidecarMedium } from 'use-sidecar';
export var mediumFocus = createMedium({}, function (_ref) {
  var target = _ref.target,
      currentTarget = _ref.currentTarget;
  return {
    target: target,
    currentTarget: currentTarget
  };
});
export var mediumBlur = createMedium();
export var mediumEffect = createMedium();
export var mediumSidecar = createSidecarMedium({
  async: true // focus-lock sidecar is not required on the server
  // however, it might be required for JSDOM tests
  // ssr: true,

});
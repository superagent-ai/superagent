import { trackElementSize } from './track-size.mjs';

function trackElementsSize(options) {
  const { getNodes, observeMutation = true, callback } = options;
  const cleanups = [];
  let firstNode = null;
  function trigger() {
    const elements = getNodes();
    firstNode = elements[0];
    const fns = elements.map(
      (element, index) => trackElementSize(element, (size) => {
        callback(size, index);
      })
    );
    cleanups.push(...fns);
  }
  trigger();
  if (observeMutation) {
    const fn = trackMutation(firstNode, trigger);
    cleanups.push(fn);
  }
  return () => {
    cleanups.forEach((cleanup) => {
      cleanup?.();
    });
  };
}
function trackMutation(el, cb) {
  if (!el || !el.parentElement)
    return;
  const win = el.ownerDocument?.defaultView ?? window;
  const observer = new win.MutationObserver(() => {
    cb();
  });
  observer.observe(el.parentElement, { childList: true });
  return () => {
    observer.disconnect();
  };
}

export { trackElementsSize };

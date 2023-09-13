import { MixedEventListener } from './types.js';

declare function addPointerEvent(target: EventTarget, type: string, cb: MixedEventListener, options?: AddEventListenerOptions): () => void;

export { addPointerEvent };

declare function addDomEvent(target: EventTarget, eventName: string, handler: EventListener, options?: AddEventListenerOptions): () => void;

export { addDomEvent };

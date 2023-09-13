interface EventListeners {
    add<K extends keyof DocumentEventMap>(el: EventTarget, type: K, listener: (this: Document, ev: DocumentEventMap[K]) => any, options?: boolean | AddEventListenerOptions): void;
    add(el: EventTarget, type: string, listener: EventListenerOrEventListenerObject, options?: boolean | AddEventListenerOptions): void;
    remove<K extends keyof DocumentEventMap>(el: EventTarget, type: K, listener: (this: Document, ev: DocumentEventMap[K]) => any, options?: boolean | EventListenerOptions): void;
    remove(el: EventTarget, type: string, listener: EventListenerOrEventListenerObject, options?: boolean | EventListenerOptions): void;
}
declare function useEventListeners(): EventListeners;

export { useEventListeners };

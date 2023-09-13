type Target = EventTarget | null | (() => EventTarget | null);
type Options = boolean | AddEventListenerOptions;
declare function useEventListener<K extends keyof DocumentEventMap>(target: Target, event: K, handler?: (event: DocumentEventMap[K]) => void, options?: Options): VoidFunction;
declare function useEventListener<K extends keyof WindowEventMap>(target: Target, event: K, handler?: (event: WindowEventMap[K]) => void, options?: Options): VoidFunction;
declare function useEventListener<K extends keyof GlobalEventHandlersEventMap>(target: Target, event: K, handler?: (event: GlobalEventHandlersEventMap[K]) => void, options?: Options): VoidFunction;

export { useEventListener };

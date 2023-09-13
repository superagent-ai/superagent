type DocumentOrElement = Document | HTMLElement | null;
type EventListenerEnv = (() => DocumentOrElement) | DocumentOrElement;
/**
 * React hook to manage browser event listeners
 *
 * @param event the event name
 * @param handler the event handler function to execute
 * @param env the dom environment to execute against (defaults to `document`)
 * @param options the event listener options
 *
 * @internal
 */
declare function useEventListener<K extends keyof DocumentEventMap>(event: K | (string & {}), handler?: (event: DocumentEventMap[K]) => void, env?: EventListenerEnv, options?: boolean | AddEventListenerOptions): () => void;

export { EventListenerEnv, useEventListener };

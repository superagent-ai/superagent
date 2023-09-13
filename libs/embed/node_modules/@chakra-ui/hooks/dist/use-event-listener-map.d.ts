import { PointerEventInfo, EventListenerWithPointInfo } from '@chakra-ui/utils';

interface EventListeners {
    add<K extends keyof DocumentEventMap>(el: EventTarget, type: K, listener: (ev: DocumentEventMap[K], info: PointerEventInfo) => any, options?: boolean | AddEventListenerOptions): void;
    add(el: EventTarget, type: string, listener: EventListenerWithPointInfo, options?: boolean | AddEventListenerOptions): void;
    remove<K extends keyof DocumentEventMap>(el: EventTarget, type: K, listener: (ev: DocumentEventMap[K], info: PointerEventInfo) => any, options?: boolean | EventListenerOptions): void;
    remove(el: EventTarget, type: string, listener: EventListenerWithPointInfo, options?: boolean | EventListenerOptions): void;
}
declare function useEventListenerMap(): EventListeners;

export { useEventListenerMap };

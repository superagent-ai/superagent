import { PanEventHandler } from './types.js';

interface UsePanEventProps {
    onPan?: PanEventHandler;
    onPanStart?: PanEventHandler;
    onPanEnd?: PanEventHandler;
    onPanSessionStart?: PanEventHandler;
    onPanSessionEnd?: PanEventHandler;
    threshold?: number;
}
declare function usePanEvent(ref: React.RefObject<HTMLElement>, options: UsePanEventProps): void;

export { UsePanEventProps, usePanEvent };

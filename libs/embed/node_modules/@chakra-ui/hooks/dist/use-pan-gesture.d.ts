import { PanEventHandler } from '@chakra-ui/utils';

interface UsePanGestureProps {
    onPan?: PanEventHandler;
    onPanStart?: PanEventHandler;
    onPanEnd?: PanEventHandler;
    onPanSessionStart?: PanEventHandler;
    onPanSessionEnd?: PanEventHandler;
    threshold?: number;
}
declare function usePanGesture(ref: React.RefObject<HTMLElement>, props: UsePanGestureProps): void;

export { UsePanGestureProps, usePanGesture };

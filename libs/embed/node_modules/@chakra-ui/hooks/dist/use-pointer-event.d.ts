import { EventListenerWithPointInfo } from '@chakra-ui/utils';
import { EventListenerEnv } from './use-event-listener.js';

/**
 * Credit goes to `framer-motion` of this useful utilities.
 * License can be found here: https://github.com/framer/motion
 */

/**
 * @internal
 */
declare function usePointerEvent(env: EventListenerEnv, eventName: string, handler: EventListenerWithPointInfo, options?: AddEventListenerOptions): () => void;

export { usePointerEvent };

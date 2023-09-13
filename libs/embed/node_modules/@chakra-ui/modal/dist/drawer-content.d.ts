import * as _chakra_ui_system from '@chakra-ui/system';
import { HTMLChakraProps } from '@chakra-ui/system';
import { HTMLMotionProps } from 'framer-motion';

interface DrawerContentProps extends HTMLChakraProps<"section"> {
    /**
     * The props to forward to the modal's content wrapper
     */
    containerProps?: HTMLChakraProps<"div">;
    /**
     * The custom framer-motion transition to use for the modal
     */
    motionProps?: HTMLMotionProps<"section">;
}
/**
 * ModalContent is used to group modal's content. It has all the
 * necessary `aria-*` properties to indicate that it is a modal
 */
declare const DrawerContent: _chakra_ui_system.ComponentWithAs<"section", DrawerContentProps>;

export { DrawerContent, DrawerContentProps };

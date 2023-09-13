import * as _chakra_ui_system from '@chakra-ui/system';
import { ChakraProps } from '@chakra-ui/system';
import { HTMLMotionProps } from 'framer-motion';

interface ModalOverlayProps extends Omit<HTMLMotionProps<"div">, "color" | "transition">, ChakraProps {
    children?: React.ReactNode;
    motionProps?: HTMLMotionProps<"div">;
}
/**
 * ModalOverlay renders a backdrop behind the modal. It is
 * also used as a wrapper for the modal content for better positioning.
 *
 * @see Docs https://chakra-ui.com/modal
 */
declare const ModalOverlay: _chakra_ui_system.ComponentWithAs<"div", ModalOverlayProps>;

export { ModalOverlay, ModalOverlayProps };

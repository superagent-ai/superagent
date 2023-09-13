import * as react from 'react';
import { ChakraProps } from '@chakra-ui/system';
import { HTMLMotionProps } from 'framer-motion';

interface ModalTransitionProps extends Omit<HTMLMotionProps<"section">, "color" | "transition">, ChakraProps {
    preset?: "slideInBottom" | "slideInRight" | "scale" | "none";
    motionProps?: HTMLMotionProps<"section">;
}
declare const ModalTransition: react.ForwardRefExoticComponent<ModalTransitionProps & react.RefAttributes<any>>;

export { ModalTransition, ModalTransitionProps };

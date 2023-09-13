import * as _chakra_ui_system from '@chakra-ui/system';
import { HTMLChakraProps, ThemingProps } from '@chakra-ui/system';
import { Orientation } from './step-context.js';
import 'react';

interface StepperProps extends HTMLChakraProps<"div">, ThemingProps<"Stepper"> {
    /**
     * The active step index
     */
    index: number;
    /**
     * The orientation of the stepper
     * @default horizontal
     */
    orientation?: Orientation;
    /**
     * Whether to show or not the last separator while in vertical orientation
     */
    showLastSeparator?: boolean;
    /**
     */
    children: React.ReactNode;
}
declare const Stepper: _chakra_ui_system.ComponentWithAs<"div", StepperProps>;

export { Stepper, StepperProps };

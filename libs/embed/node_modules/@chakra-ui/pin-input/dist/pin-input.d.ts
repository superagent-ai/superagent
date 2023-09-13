import * as _chakra_ui_system from '@chakra-ui/system';
import { ThemingProps, HTMLChakraProps } from '@chakra-ui/system';
import { UsePinInputProps } from './use-pin-input.js';
import 'react';
import '@chakra-ui/descendant';

interface InputOptions {
    /**
     * The border color when the input is focused. Use color keys in `theme.colors`
     * @example
     * focusBorderColor = "blue.500"
     */
    focusBorderColor?: string;
    /**
     * The border color when the input is invalid. Use color keys in `theme.colors`
     * @example
     * errorBorderColor = "red.500"
     */
    errorBorderColor?: string;
}
interface PinInputProps extends UsePinInputProps, ThemingProps<"PinInput">, InputOptions {
    /**
     * The children of the pin input component
     */
    children: React.ReactNode;
}
/**
 * The `PinInput` component is similar to the Input component, but is optimized for entering sequences of digits quickly.
 *
 * @see Docs https://chakra-ui.com/docs/components/pin-input
 */
declare function PinInput(props: PinInputProps): JSX.Element;
declare namespace PinInput {
    var displayName: string;
}
interface PinInputFieldProps extends HTMLChakraProps<"input"> {
}
declare const PinInputField: _chakra_ui_system.ComponentWithAs<"input", PinInputFieldProps>;

export { PinInput, PinInputField, PinInputFieldProps, PinInputProps };

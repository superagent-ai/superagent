import * as _chakra_ui_system from '@chakra-ui/system';
import { HTMLChakraProps, ThemingProps } from '@chakra-ui/system';
import { FormControlOptions } from '@chakra-ui/form-control';

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
    /**
     * The native HTML `size` attribute to be passed to the `input`
     */
    htmlSize?: number;
}
type Omitted = "disabled" | "required" | "readOnly" | "size";
interface InputProps extends Omit<HTMLChakraProps<"input">, Omitted>, InputOptions, ThemingProps<"Input">, FormControlOptions {
}
/**
 * Input
 *
 * Element that allows users enter single valued data.
 *
 * @see Docs https://chakra-ui.com/docs/components/input
 */
declare const Input: _chakra_ui_system.ComponentWithAs<"input", InputProps>;

export { Input, InputProps };

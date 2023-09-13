import * as _chakra_ui_system from '@chakra-ui/system';
import { HTMLChakraProps, ThemingProps } from '@chakra-ui/system';
import { FormControlOptions } from '@chakra-ui/form-control';

interface TextareaOptions {
    /**
     * The border color when the textarea is focused. Use color keys in `theme.colors`
     * @example
     * focusBorderColor = "blue.500"
     */
    focusBorderColor?: string;
    /**
     * The border color when the textarea is invalid. Use color keys in `theme.colors`
     * @example
     * errorBorderColor = "red.500"
     */
    errorBorderColor?: string;
}
type Omitted = "disabled" | "required" | "readOnly";
interface TextareaProps extends Omit<HTMLChakraProps<"textarea">, Omitted>, TextareaOptions, FormControlOptions, ThemingProps<"Textarea"> {
}
/**
 * Textarea is used to enter an amount of text that's longer than a single line
 * @see Docs https://chakra-ui.com/textarea
 */
declare const Textarea: _chakra_ui_system.ComponentWithAs<"textarea", TextareaProps>;

export { Textarea, TextareaProps };

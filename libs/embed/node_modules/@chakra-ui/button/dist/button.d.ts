import * as _chakra_ui_system from '@chakra-ui/system';
import { HTMLChakraProps, ThemingProps } from '@chakra-ui/system';
import { ButtonOptions } from './button-types.js';

interface ButtonProps extends HTMLChakraProps<"button">, ButtonOptions, ThemingProps<"Button"> {
}
/**
 * Button component is used to trigger an action or event, such as submitting a form, opening a Dialog, canceling an action, or performing a delete operation.
 *
 * @see Docs https://chakra-ui.com/docs/components/button
 * @see WAI-ARIA https://www.w3.org/WAI/ARIA/apg/patterns/button/
 */
declare const Button: _chakra_ui_system.ComponentWithAs<"button", ButtonProps>;

export { Button, ButtonProps };

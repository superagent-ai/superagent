import * as _chakra_ui_system from '@chakra-ui/system';
import { HTMLChakraProps } from '@chakra-ui/system';

interface MenuButtonProps extends HTMLChakraProps<"button"> {
}
/**
 * The trigger for the menu list. Must be a direct child of `Menu`.
 *
 * @see WAI-ARIA https://www.w3.org/WAI/ARIA/apg/patterns/menubutton/
 */
declare const MenuButton: _chakra_ui_system.ComponentWithAs<"button", MenuButtonProps>;

export { MenuButton, MenuButtonProps };

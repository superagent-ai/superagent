import * as _chakra_ui_system from '@chakra-ui/system';
import { HTMLChakraProps, ThemingProps } from '@chakra-ui/system';
import { ButtonGroupOptions } from './button-types.js';

interface ButtonGroupProps extends HTMLChakraProps<"div">, ThemingProps<"Button">, ButtonGroupOptions {
}
declare const ButtonGroup: _chakra_ui_system.ComponentWithAs<"div", ButtonGroupProps>;

export { ButtonGroup, ButtonGroupProps };

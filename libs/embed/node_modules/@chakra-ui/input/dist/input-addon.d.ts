import * as _chakra_ui_system from '@chakra-ui/system';
import { HTMLChakraProps } from '@chakra-ui/system';

type Placement = "left" | "right";
interface InputAddonProps extends HTMLChakraProps<"div"> {
    placement?: Placement;
}
/**
 * InputAddon
 *
 * Element to append or prepend to an input
 */
declare const InputAddon: _chakra_ui_system.ComponentWithAs<"div", InputAddonProps>;
type InputLeftAddonProps = InputAddonProps;
/**
 * InputLeftAddon
 *
 * Element to append to the left of an input
 */
declare const InputLeftAddon: _chakra_ui_system.ComponentWithAs<"div", InputAddonProps>;
type InputRightAddonProps = InputAddonProps;
/**
 * InputRightAddon
 *
 * Element to append to the right of an input
 */
declare const InputRightAddon: _chakra_ui_system.ComponentWithAs<"div", InputAddonProps>;

export { InputAddon, InputAddonProps, InputLeftAddon, InputLeftAddonProps, InputRightAddon, InputRightAddonProps };

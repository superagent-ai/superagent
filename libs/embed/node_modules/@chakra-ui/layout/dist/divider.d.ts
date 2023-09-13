import * as _chakra_ui_system from '@chakra-ui/system';
import { HTMLChakraProps, ThemingProps } from '@chakra-ui/system';

/**
 * Layout component used to visually separate content in a list or group.
 * It displays a thin horizontal or vertical line, and renders a `hr` tag.
 *
 * @see Docs https://chakra-ui.com/divider
 */
declare const Divider: _chakra_ui_system.ComponentWithAs<"hr", DividerProps>;
interface DividerProps extends HTMLChakraProps<"div">, ThemingProps<"Divider"> {
    orientation?: "horizontal" | "vertical";
}

export { Divider, DividerProps };

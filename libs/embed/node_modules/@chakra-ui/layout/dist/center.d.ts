import * as _chakra_ui_system from '@chakra-ui/system';
import { HTMLChakraProps } from '@chakra-ui/system';

interface CenterProps extends HTMLChakraProps<"div"> {
}
/**
 * React component used to horizontally and vertically center its child.
 * It uses the popular `display: flex` centering technique.
 *
 * @see Docs https://chakra-ui.com/center
 */
declare const Center: _chakra_ui_system.ChakraComponent<"div", {}>;
interface AbsoluteCenterProps extends HTMLChakraProps<"div"> {
    axis?: "horizontal" | "vertical" | "both";
}
/**
 * React component used to horizontally and vertically center an element
 * relative to its parent dimensions.
 *
 * It uses the `position: absolute` strategy.
 *
 * @see Docs https://chakra-ui.com/center
 * @see WebDev https://web.dev/centering-in-css/#5.-pop-and-plop
 */
declare const AbsoluteCenter: _chakra_ui_system.ComponentWithAs<"div", AbsoluteCenterProps>;

export { AbsoluteCenter, AbsoluteCenterProps, Center, CenterProps };

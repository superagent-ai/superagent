import * as _chakra_ui_system from '@chakra-ui/system';
import { HTMLChakraProps } from '@chakra-ui/system';

interface BoxProps extends HTMLChakraProps<"div"> {
}
/**
 * Box is the most abstract component on top of which other chakra
 * components are built. It renders a `div` element by default.
 *
 * @see Docs https://chakra-ui.com/box
 */
declare const Box: _chakra_ui_system.ChakraComponent<"div", {}>;
/**
 * As a constraint, you can't pass size related props
 * Only `size` would be allowed
 */
type Omitted = "size" | "boxSize" | "width" | "height" | "w" | "h";
interface SquareProps extends Omit<BoxProps, Omitted> {
    /**
     * The size (width and height) of the square
     */
    size?: BoxProps["width"];
    /**
     * If `true`, the content will be centered in the square
     *
     * @default false
     */
    centerContent?: boolean;
}
declare const Square: _chakra_ui_system.ComponentWithAs<"div", SquareProps>;
declare const Circle: _chakra_ui_system.ComponentWithAs<"div", SquareProps>;

export { Box, BoxProps, Circle, Square, SquareProps };

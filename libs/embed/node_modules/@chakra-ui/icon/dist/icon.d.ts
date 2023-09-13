import * as _chakra_ui_system from '@chakra-ui/system';
import { ChakraProps } from '@chakra-ui/system';

type Orientation = "vertical" | "horizontal";
interface IconProps extends Omit<React.SVGAttributes<SVGElement>, keyof ChakraProps>, ChakraProps {
    orientation?: Orientation;
}
/**
 * The Icon component renders as an svg element to help define your own custom components.
 *
 * @see Docs https://chakra-ui.com/docs/components/icon#using-the-icon-component
 */
declare const Icon: _chakra_ui_system.ComponentWithAs<"svg", IconProps>;

export { Icon, IconProps, Icon as default };

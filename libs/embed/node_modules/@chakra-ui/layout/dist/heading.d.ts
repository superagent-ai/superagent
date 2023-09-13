import * as _chakra_ui_system from '@chakra-ui/system';
import { HTMLChakraProps, ThemingProps } from '@chakra-ui/system';

interface HeadingProps extends HTMLChakraProps<"h2">, ThemingProps<"Heading"> {
}
/**
 * `Heading` is used to render semantic HTML heading elements.
 *
 * By default, renders as `h2` with themantic size `xl`
 *
 * @see Docs https://chakra-ui.com/docs/components/heading
 */
declare const Heading: _chakra_ui_system.ComponentWithAs<"h2", HeadingProps>;

export { Heading, HeadingProps };

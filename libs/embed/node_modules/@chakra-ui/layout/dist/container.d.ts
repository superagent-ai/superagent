import * as _chakra_ui_system from '@chakra-ui/system';
import { HTMLChakraProps, ThemingProps } from '@chakra-ui/system';

interface ContainerProps extends HTMLChakraProps<"div">, ThemingProps<"Container"> {
    /**
     * If `true`, container will center its children
     * regardless of their width.
     *
     * @default false
     */
    centerContent?: boolean;
}
/**
 * Layout component used to wrap app or website content
 *
 * It sets `margin-left` and `margin-right` to `auto`,
 * to keep its content centered.
 *
 * It also sets a default max-width of `60ch` (60 characters).
 *
 * @see Docs https://chakra-ui.com/docs/components/container
 */
declare const Container: _chakra_ui_system.ComponentWithAs<"div", ContainerProps>;

export { Container, ContainerProps };

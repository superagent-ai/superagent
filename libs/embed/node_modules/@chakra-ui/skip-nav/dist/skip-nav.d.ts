import * as _chakra_ui_system from '@chakra-ui/system';
import { HTMLChakraProps, ThemingProps } from '@chakra-ui/system';

interface SkipNavLinkProps extends HTMLChakraProps<"a">, ThemingProps<"SkipNavLink"> {
}
/**
 * Renders a link that remains hidden until focused to skip to the main content.
 *
 * @see Docs https://chakra-ui.com/docs/components/skip-nav
 */
declare const SkipNavLink: _chakra_ui_system.ComponentWithAs<"a", SkipNavLinkProps>;
interface SkipNavContentProps extends HTMLChakraProps<"div"> {
}
/**
 * Renders a div as the target for the `SkipNavLink`.
 *
 * @see Docs https://chakra-ui.com/docs/components/skip-nav
 */
declare const SkipNavContent: _chakra_ui_system.ComponentWithAs<"div", SkipNavContentProps>;

export { SkipNavContent, SkipNavContentProps, SkipNavLink, SkipNavLinkProps };

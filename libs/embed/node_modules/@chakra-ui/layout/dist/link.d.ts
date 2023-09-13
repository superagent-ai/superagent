import * as _chakra_ui_system from '@chakra-ui/system';
import { HTMLChakraProps, ThemingProps } from '@chakra-ui/system';

interface LinkProps extends HTMLChakraProps<"a">, ThemingProps<"Link"> {
    /**
     *  If `true`, the link will open in new tab
     *
     * @default false
     */
    isExternal?: boolean;
}
/**
 * Links are accessible elements used primarily for navigation.
 *
 * It integrates well with other routing libraries like
 * React Router, Reach Router and Next.js Link.
 *
 * @example
 *
 * ```jsx
 * <Link as={ReactRouterLink} to="/home">Home</Link>
 * ```
 *
 * @see Docs https://chakra-ui.com/link
 */
declare const Link: _chakra_ui_system.ComponentWithAs<"a", LinkProps>;

export { Link, LinkProps };

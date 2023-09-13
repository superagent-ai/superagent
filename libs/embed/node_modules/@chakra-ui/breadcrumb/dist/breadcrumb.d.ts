import * as _chakra_ui_system from '@chakra-ui/system';
import { HTMLChakraProps, ThemingProps } from '@chakra-ui/system';
import { BreadcrumbOptions } from './breadcrumb-types.js';

interface BreadcrumbProps extends HTMLChakraProps<"nav">, BreadcrumbOptions, ThemingProps<"Breadcrumb"> {
    listProps?: HTMLChakraProps<"ol">;
}
/**
 * Breadcrumb is used to render a breadcrumb navigation landmark.
 * It renders a `nav` element with `aria-label` set to `Breadcrumb`
 *
 * @see Docs https://chakra-ui.com/breadcrumb
 * @see WAI-ARIA https://www.w3.org/WAI/ARIA/apg/patterns/breadcrumb/
 */
declare const Breadcrumb: _chakra_ui_system.ComponentWithAs<"nav", BreadcrumbProps>;

export { Breadcrumb, BreadcrumbProps };

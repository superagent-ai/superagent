import * as _chakra_ui_system from '@chakra-ui/system';
import { HTMLChakraProps } from '@chakra-ui/system';
import { BreadcrumbItemOptions } from './breadcrumb-types.js';

interface BreadcrumbItemProps extends BreadcrumbItemOptions, HTMLChakraProps<"li"> {
}
/**
 * BreadcrumbItem is used to group a breadcrumb link.
 * It renders a `li` element to denote it belongs to an order list of links.
 *
 * @see Docs https://chakra-ui.com/breadcrumb
 */
declare const BreadcrumbItem: _chakra_ui_system.ComponentWithAs<"li", BreadcrumbItemProps>;

export { BreadcrumbItem, BreadcrumbItemProps };

import * as _chakra_ui_system from '@chakra-ui/system';
import { HTMLChakraProps } from '@chakra-ui/system';

interface BreadcrumbLinkProps extends HTMLChakraProps<"a"> {
    /**
     * @default false
     */
    isCurrentPage?: boolean;
}
/**
 * Breadcrumb link.
 *
 * It renders a `span` when it matches the current link. Otherwise,
 * it renders an anchor tag.
 */
declare const BreadcrumbLink: _chakra_ui_system.ComponentWithAs<"a", BreadcrumbLinkProps>;

export { BreadcrumbLink, BreadcrumbLinkProps };

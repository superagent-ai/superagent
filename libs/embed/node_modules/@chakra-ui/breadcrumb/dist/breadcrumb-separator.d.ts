import * as _chakra_ui_system from '@chakra-ui/system';
import { HTMLChakraProps, SystemStyleObject } from '@chakra-ui/system';

interface BreadcrumbSeparatorProps extends HTMLChakraProps<"div"> {
    /**
     * @type SystemStyleObject["mx"]
     */
    spacing?: SystemStyleObject["mx"];
}
/**
 * React component that separates each breadcrumb link
 */
declare const BreadcrumbSeparator: _chakra_ui_system.ComponentWithAs<"span", BreadcrumbSeparatorProps>;

export { BreadcrumbSeparator, BreadcrumbSeparatorProps };

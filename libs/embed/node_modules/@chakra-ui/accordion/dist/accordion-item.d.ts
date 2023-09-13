import * as _chakra_ui_system from '@chakra-ui/system';
import { HTMLChakraProps } from '@chakra-ui/system';
import { UseAccordionItemProps } from './use-accordion.js';
import '@chakra-ui/descendant';
import 'react';

interface AccordionItemProps extends Omit<HTMLChakraProps<"div">, keyof UseAccordionItemProps | "children">, UseAccordionItemProps {
    children?: React.ReactNode | ((props: {
        isExpanded: boolean;
        isDisabled: boolean;
    }) => React.ReactNode);
}
/**
 * AccordionItem is a single accordion that provides the open-close
 * behavior when the accordion button is clicked.
 *
 * It also provides context for the accordion button and panel.
 */
declare const AccordionItem: _chakra_ui_system.ComponentWithAs<"div", AccordionItemProps>;

export { AccordionItem, AccordionItemProps };

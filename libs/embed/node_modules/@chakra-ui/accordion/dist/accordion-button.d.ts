import * as _chakra_ui_system from '@chakra-ui/system';
import { HTMLChakraProps } from '@chakra-ui/system';

interface AccordionButtonProps extends HTMLChakraProps<"button"> {
}
/**
 * AccordionButton is used expands and collapses an accordion item.
 * It must be a child of `AccordionItem`.
 *
 * Note 🚨: Each accordion button must be wrapped in a heading tag,
 * that is appropriate for the information architecture of the page.
 */
declare const AccordionButton: _chakra_ui_system.ComponentWithAs<"button", AccordionButtonProps>;

export { AccordionButton, AccordionButtonProps };

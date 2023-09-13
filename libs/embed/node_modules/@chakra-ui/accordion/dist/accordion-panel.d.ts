import * as _chakra_ui_system from '@chakra-ui/system';
import { HTMLChakraProps } from '@chakra-ui/system';
import { CollapseProps } from '@chakra-ui/transition';

interface AccordionPanelProps extends HTMLChakraProps<"div"> {
    /**
     * The properties passed to the underlying `Collapse` component.
     */
    motionProps?: CollapseProps;
}
/**
 * Accordion panel that holds the content for each accordion.
 * It shows and hides based on the state login from the `AccordionItem`.
 *
 * It uses the `Collapse` component to animate its height.
 */
declare const AccordionPanel: _chakra_ui_system.ComponentWithAs<"div", AccordionPanelProps>;

export { AccordionPanel, AccordionPanelProps };

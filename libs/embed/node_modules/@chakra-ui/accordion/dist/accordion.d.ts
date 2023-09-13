import * as _chakra_ui_system from '@chakra-ui/system';
import { HTMLChakraProps, ThemingProps } from '@chakra-ui/system';
import { UseAccordionProps } from './use-accordion.js';
import '@chakra-ui/descendant';
import 'react';

interface AccordionProps extends UseAccordionProps, Omit<HTMLChakraProps<"div">, keyof UseAccordionProps>, ThemingProps<"Accordion"> {
    /**
     * If `true`, height animation and transitions will be disabled.
     *
     * @default false
     */
    reduceMotion?: boolean;
}
/**
 * The wrapper that provides context and focus management
 * for all accordion items.
 *
 * It wraps all accordion items in a `div` for better grouping.
 * @see Docs https://chakra-ui.com/accordion
 * @see WAI-ARIA https://www.w3.org/WAI/ARIA/apg/patterns/accordion/
 */
declare const Accordion: _chakra_ui_system.ComponentWithAs<"div", AccordionProps>;

export { Accordion, AccordionProps };

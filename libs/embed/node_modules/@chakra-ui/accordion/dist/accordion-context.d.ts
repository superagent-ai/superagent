import * as _chakra_ui_descendant from '@chakra-ui/descendant';
import * as react from 'react';
import { SystemStyleObject } from '@chakra-ui/system';
import { UseAccordionItemReturn } from './use-accordion.js';

declare const AccordionStylesProvider: react.Provider<Record<string, SystemStyleObject>>;
declare const useAccordionStyles: () => Record<string, SystemStyleObject>;
type AccordionItemContext = Omit<UseAccordionItemReturn, "htmlProps">;
declare const AccordionItemProvider: react.Provider<AccordionItemContext>;
declare const useAccordionItemContext: () => AccordionItemContext;
declare const AccordionDescendantsProvider: react.Provider<_chakra_ui_descendant.DescendantsManager<HTMLButtonElement, {}>>;
declare const useAccordionDescendantsContext: () => _chakra_ui_descendant.DescendantsManager<HTMLButtonElement, {}>;
declare const useAccordionDescendants: () => _chakra_ui_descendant.DescendantsManager<HTMLButtonElement, {}>;
declare const useAccordionDescendant: (options?: {
    disabled?: boolean | undefined;
    id?: string | undefined;
} | undefined) => {
    descendants: _chakra_ui_descendant.UseDescendantsReturn;
    index: number;
    enabledIndex: number;
    register: (node: HTMLButtonElement | null) => void;
};

export { AccordionDescendantsProvider, AccordionItemProvider, AccordionStylesProvider, useAccordionDescendant, useAccordionDescendants, useAccordionDescendantsContext, useAccordionItemContext, useAccordionStyles };

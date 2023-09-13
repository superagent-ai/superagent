import * as _chakra_ui_system from '@chakra-ui/system';
import { SystemStyleObject, ThemingProps, HTMLChakraProps } from '@chakra-ui/system';
import { UseTabsProps } from './use-tabs.js';
import 'react';
import '@chakra-ui/descendant';
import '@chakra-ui/clickable';
import '@chakra-ui/lazy-utils';

declare const useTabsStyles: () => Record<string, SystemStyleObject>;

interface TabsOptions {
    /**
     * If `true`, tabs will stretch to width of the tablist.
     * @default false
     */
    isFitted?: boolean;
    /**
     * The alignment of the tabs
     */
    align?: "start" | "end" | "center";
}
interface TabsProps extends UseTabsProps, ThemingProps<"Tabs">, Omit<HTMLChakraProps<"div">, "onChange">, TabsOptions {
    children: React.ReactNode;
}
/**
 * Tabs
 *
 * Provides context and logic for all tabs components.
 *
 * @see Docs https://chakra-ui.com/docs/components/tabs
 * @see WAI-ARIA https://www.w3.org/WAI/ARIA/apg/patterns/tabpanel/
 */
declare const Tabs: _chakra_ui_system.ComponentWithAs<"div", TabsProps>;

export { Tabs, TabsProps, useTabsStyles };

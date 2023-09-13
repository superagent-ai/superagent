import * as _chakra_ui_system from '@chakra-ui/system';
import { HTMLChakraProps } from '@chakra-ui/system';
import { UseTabListProps } from './use-tabs.js';
import 'react';
import '@chakra-ui/descendant';
import '@chakra-ui/clickable';
import '@chakra-ui/lazy-utils';

interface TabListProps extends UseTabListProps, Omit<HTMLChakraProps<"div">, "onKeyDown" | "ref"> {
}
/**
 * TabList is used to manage a list of tab buttons. It renders a `div` by default,
 * and is responsible the keyboard interaction between tabs.
 */
declare const TabList: _chakra_ui_system.ComponentWithAs<"div", TabListProps>;

export { TabList, TabListProps };

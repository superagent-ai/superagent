import * as _chakra_ui_system from '@chakra-ui/system';
import { HTMLChakraProps } from '@chakra-ui/system';
import { UseTabOptions } from './use-tabs.js';
import 'react';
import '@chakra-ui/descendant';
import '@chakra-ui/clickable';
import '@chakra-ui/lazy-utils';

interface TabProps extends UseTabOptions, HTMLChakraProps<"button"> {
}
/**
 * Tab button used to activate a specific tab panel. It renders a `button`,
 * and is responsible for automatic and manual selection modes.
 */
declare const Tab: _chakra_ui_system.ComponentWithAs<"button", TabProps>;

export { Tab, TabProps };

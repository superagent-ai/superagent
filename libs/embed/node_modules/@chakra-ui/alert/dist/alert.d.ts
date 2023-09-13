import * as _chakra_ui_system from '@chakra-ui/system';
import { HTMLChakraProps, ThemingProps } from '@chakra-ui/system';
import { AlertStatus } from './alert-context.js';
import '@chakra-ui/spinner';
import 'react';
import './icons.js';
import '@chakra-ui/icon';

interface AlertOptions {
    /**
     * The status of the alert
     * @default "info"
     */
    status?: AlertStatus;
}
interface AlertProps extends HTMLChakraProps<"div">, AlertOptions, ThemingProps<"Alert"> {
    /**
     * @default false
     */
    addRole?: boolean;
}
/**
 * Alert is used to communicate the state or status of a
 * page, feature or action
 *
 * @see Docs https://chakra-ui.com/docs/components/alert
 * @see WAI-ARIA https://www.w3.org/WAI/ARIA/apg/patterns/alert/
 */
declare const Alert: _chakra_ui_system.ComponentWithAs<"div", AlertProps>;

export { Alert, AlertProps };

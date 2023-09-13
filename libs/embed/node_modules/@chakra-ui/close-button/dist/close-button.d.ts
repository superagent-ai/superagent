import * as _chakra_ui_system from '@chakra-ui/system';
import { HTMLChakraProps, ThemingProps } from '@chakra-ui/system';

interface CloseButtonProps extends HTMLChakraProps<"button">, ThemingProps<"CloseButton"> {
    /**
     * If `true`, the close button will be disabled.
     * @default false
     */
    isDisabled?: boolean;
}
/**
 * A button with a close icon.
 *
 * It is used to handle the close functionality in feedback and overlay components
 * like Alerts, Toasts, Drawers and Modals.
 *
 * @see Docs https://chakra-ui.com/docs/components/close-button
 */
declare const CloseButton: _chakra_ui_system.ComponentWithAs<"button", CloseButtonProps>;

export { CloseButton, CloseButtonProps };

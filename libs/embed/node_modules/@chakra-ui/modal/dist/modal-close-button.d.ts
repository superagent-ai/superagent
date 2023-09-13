import * as _chakra_ui_system from '@chakra-ui/system';
import { CloseButtonProps } from '@chakra-ui/close-button';

type ModalCloseButtonProps = CloseButtonProps;
/**
 * ModalCloseButton is used closes the modal.
 *
 * You don't need to pass the `onClick` to it, it reads the
 * `onClose` action from the modal context.
 */
declare const ModalCloseButton: _chakra_ui_system.ComponentWithAs<"button", CloseButtonProps>;

export { ModalCloseButton, ModalCloseButtonProps };

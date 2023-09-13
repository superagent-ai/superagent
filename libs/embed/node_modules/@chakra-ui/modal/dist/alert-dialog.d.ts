import * as _chakra_ui_system from '@chakra-ui/system';
import { ModalProps } from './modal.js';
import { ModalContentProps } from './modal-content.js';
export { ModalBody as AlertDialogBody } from './modal-body.js';
export { ModalCloseButton as AlertDialogCloseButton } from './modal-close-button.js';
export { ModalFooter as AlertDialogFooter } from './modal-footer.js';
export { ModalHeader as AlertDialogHeader } from './modal-header.js';
export { ModalOverlay as AlertDialogOverlay } from './modal-overlay.js';
import 'react';
import '@chakra-ui/focus-lock';
import '@chakra-ui/portal';
import './use-modal.js';
import '@chakra-ui/react-types';
import 'framer-motion';
import '@chakra-ui/close-button';

interface AlertDialogProps extends Omit<ModalProps, "initialFocusRef"> {
    leastDestructiveRef: NonNullable<ModalProps["initialFocusRef"]>;
}
/**
 * `AlertDialog` component is used interrupt the user with a mandatory confirmation or action.
 *
 * @see Docs https://chakra-ui.com/docs/components/alert-dialog
 * @see WAI-ARIA https://www.w3.org/WAI/ARIA/apg/patterns/alertdialog/
 */
declare function AlertDialog(props: AlertDialogProps): JSX.Element;
declare const AlertDialogContent: _chakra_ui_system.ComponentWithAs<"section", ModalContentProps>;

export { AlertDialog, AlertDialogContent, AlertDialogProps };

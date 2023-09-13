import * as _chakra_ui_system from '@chakra-ui/system';
import { ButtonProps } from './button.js';
import './button-types.js';

type OmittedProps = "leftIcon" | "rightIcon" | "loadingText" | "iconSpacing" | "spinnerPlacement";
interface BaseButtonProps extends Omit<ButtonProps, OmittedProps> {
}
interface IconButtonProps extends BaseButtonProps {
    /**
     * The icon to be used in the button.
     * @type React.ReactElement
     */
    icon?: React.ReactElement;
    /**
     * If `true`, the button will be perfectly round. Else, it'll be slightly round
     *
     * @default false
     */
    isRound?: boolean;
    /**
     * A11y: A label that describes the button
     */
    "aria-label": string;
}
/**
 * Icon button renders an icon within a button.
 *
 * @see Docs https://chakra-ui.com/docs/components/icon-button
 */
declare const IconButton: _chakra_ui_system.ComponentWithAs<"button", IconButtonProps>;

export { IconButton, IconButtonProps };

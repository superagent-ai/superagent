import * as _chakra_ui_system from '@chakra-ui/system';
import { HTMLChakraProps, SystemProps } from '@chakra-ui/system';
import { UseMenuItemProps } from './use-menu.js';
import '@chakra-ui/descendant';
import '@chakra-ui/popper';
import '@chakra-ui/react-use-disclosure';
import '@chakra-ui/lazy-utils';
import 'react';

interface StyledMenuItemProps extends HTMLChakraProps<"button"> {
}
interface MenuItemOptions extends Pick<UseMenuItemProps, "isDisabled" | "isFocusable" | "closeOnSelect"> {
    /**
     * The icon to render before the menu item's label.
     * @type React.ReactElement
     */
    icon?: React.ReactElement;
    /**
     * The spacing between the icon and menu item's label.
     * @type SystemProps["mr"]
     */
    iconSpacing?: SystemProps["mr"];
    /**
     * Right-aligned label text content, useful for displaying hotkeys.
     */
    command?: string;
    /**
     * The spacing between the command and menu item's label.
     * @type SystemProps["ml"]
     */
    commandSpacing?: SystemProps["ml"];
}
/**
 * Use prop `isDisabled` instead
 */
type IsDisabledProps = "disabled" | "aria-disabled";
interface MenuItemProps extends Omit<HTMLChakraProps<"button">, IsDisabledProps>, MenuItemOptions {
}
declare const MenuItem: _chakra_ui_system.ComponentWithAs<"button", MenuItemProps>;

export { MenuItem, MenuItemProps, StyledMenuItemProps };

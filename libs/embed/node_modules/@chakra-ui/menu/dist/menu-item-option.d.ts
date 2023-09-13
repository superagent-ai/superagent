import * as _chakra_ui_system from '@chakra-ui/system';
import { SystemProps } from '@chakra-ui/system';
import { ReactElement } from 'react';
import { MenuItemProps } from './menu-item.js';
import { UseMenuOptionOptions } from './use-menu.js';
import '@chakra-ui/descendant';
import '@chakra-ui/popper';
import '@chakra-ui/react-use-disclosure';
import '@chakra-ui/lazy-utils';

interface MenuItemOptionProps extends UseMenuOptionOptions, Omit<MenuItemProps, keyof UseMenuOptionOptions | "icon"> {
    /**
     * @type React.ReactElement
     */
    icon?: ReactElement | null;
    /**
     * @type SystemProps["mr"]
     */
    iconSpacing?: SystemProps["mr"];
}
declare const MenuItemOption: _chakra_ui_system.ComponentWithAs<"button", MenuItemOptionProps>;

export { MenuItemOption, MenuItemOptionProps };

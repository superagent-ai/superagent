import { SystemStyleObject, ThemingProps } from '@chakra-ui/system';
import { UseMenuProps } from './use-menu.js';
import '@chakra-ui/descendant';
import '@chakra-ui/popper';
import '@chakra-ui/react-use-disclosure';
import '@chakra-ui/lazy-utils';
import 'react';

declare const useMenuStyles: () => Record<string, SystemStyleObject>;

type MaybeRenderProp<P> = React.ReactNode | ((props: P) => React.ReactNode);
interface MenuProps extends UseMenuProps, ThemingProps<"Menu"> {
    children: MaybeRenderProp<{
        isOpen: boolean;
        onClose: () => void;
        forceUpdate: (() => void) | undefined;
    }>;
}
/**
 * Menu provides context, state, and focus management
 * to its sub-components. It doesn't render any DOM node.
 *
 * @see Docs https://chakra-ui.com/docs/components/menu
 */
declare const Menu: React.FC<MenuProps>;

export { Menu, MenuProps, useMenuStyles };

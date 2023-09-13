import * as _chakra_ui_system from '@chakra-ui/system';
import { HTMLChakraProps } from '@chakra-ui/system';
import { HTMLMotionProps } from 'framer-motion';

interface MenuListProps extends HTMLChakraProps<"div"> {
    /**
     * Props for the root element that positions the menu.
     */
    rootProps?: HTMLChakraProps<"div">;
    /**
     * The framer-motion props to animate the menu list
     */
    motionProps?: HTMLMotionProps<"div">;
}
declare const MenuList: _chakra_ui_system.ComponentWithAs<"div", MenuListProps>;

export { MenuList, MenuListProps };

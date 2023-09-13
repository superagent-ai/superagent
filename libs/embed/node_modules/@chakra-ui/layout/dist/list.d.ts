import * as _chakra_ui_system from '@chakra-ui/system';
import { SystemStyleObject, HTMLChakraProps, ThemingProps, SystemProps } from '@chakra-ui/system';
import { IconProps } from '@chakra-ui/icon';

declare const useListStyles: () => Record<string, SystemStyleObject>;

interface ListOptions {
    /**
     * Shorthand prop for `listStyleType`
     * @type SystemProps["listStyleType"]
     */
    styleType?: SystemProps["listStyleType"];
    /**
     * Shorthand prop for `listStylePosition`
     * @type SystemProps["listStylePosition"]
     */
    stylePosition?: SystemProps["listStylePosition"];
    /**
     * The space between each list item
     * @type SystemProps["margin"]
     */
    spacing?: SystemProps["margin"];
}
interface ListProps extends HTMLChakraProps<"ul">, ThemingProps<"List">, ListOptions {
}
/**
 * List is used to display list items, it renders a `<ul>` by default.
 *
 * @see Docs https://chakra-ui.com/list
 */
declare const List: _chakra_ui_system.ComponentWithAs<"ul", ListProps>;
declare const OrderedList: _chakra_ui_system.ComponentWithAs<"ol", ListProps>;
declare const UnorderedList: _chakra_ui_system.ComponentWithAs<"ul", ListProps>;
interface ListItemProps extends HTMLChakraProps<"li"> {
}
/**
 * ListItem
 *
 * Used to render a list item
 */
declare const ListItem: _chakra_ui_system.ComponentWithAs<"li", ListItemProps>;
/**
 * ListIcon
 *
 * Used to render an icon beside the list item text
 */
declare const ListIcon: _chakra_ui_system.ComponentWithAs<"svg", IconProps>;

export { List, ListIcon, ListItem, ListItemProps, ListProps, OrderedList, UnorderedList, useListStyles };

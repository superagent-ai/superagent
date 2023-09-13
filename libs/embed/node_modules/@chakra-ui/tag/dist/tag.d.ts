import * as _chakra_ui_system from '@chakra-ui/system';
import { SystemStyleObject, HTMLChakraProps, ThemingProps } from '@chakra-ui/system';
import { IconProps } from '@chakra-ui/icon';

declare const useTagStyles: () => Record<string, SystemStyleObject>;

interface TagProps extends HTMLChakraProps<"span">, ThemingProps<"Tag"> {
}
/**
 * The tag component is used to label or categorize UI elements.
 * To style the tag globally, change the styles in `theme.components.Tag`
 * @see Docs https://chakra-ui.com/tag
 */
declare const Tag: _chakra_ui_system.ComponentWithAs<"span", TagProps>;
interface TagLabelProps extends HTMLChakraProps<"span"> {
}
declare const TagLabel: _chakra_ui_system.ComponentWithAs<"span", TagLabelProps>;
declare const TagLeftIcon: _chakra_ui_system.ComponentWithAs<"svg", IconProps>;
declare const TagRightIcon: _chakra_ui_system.ComponentWithAs<"svg", IconProps>;
interface TagCloseButtonProps extends Omit<HTMLChakraProps<"button">, "disabled"> {
    /**
     * @default false
     */
    isDisabled?: boolean;
}
/**
 * TagCloseButton is used to close "remove" the tag
 * @see Docs https://chakra-ui.com/tag
 */
declare const TagCloseButton: _chakra_ui_system.ComponentWithAs<"button", TagCloseButtonProps>;

export { Tag, TagCloseButton, TagCloseButtonProps, TagLabel, TagLabelProps, TagLeftIcon, TagProps, TagRightIcon, useTagStyles };

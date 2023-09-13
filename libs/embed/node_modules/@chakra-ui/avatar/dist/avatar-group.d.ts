import * as _chakra_ui_system from '@chakra-ui/system';
import { HTMLChakraProps, ThemingProps, SystemProps } from '@chakra-ui/system';

interface AvatarGroupOptions {
    /**
     * The children of the avatar group.
     *
     * Ideally should be `Avatar` and `MoreIndicator` components
     */
    children: React.ReactNode;
    /**
     * The space between the avatars in the group.
     * @default "-0.75rem"
     * @type SystemProps["margin"]
     */
    spacing?: SystemProps["margin"];
    /**
     * The maximum number of visible avatars
     */
    max?: number;
}
interface AvatarGroupProps extends AvatarGroupOptions, Omit<HTMLChakraProps<"div">, "children">, ThemingProps<"Avatar"> {
}
/**
 * AvatarGroup displays a number of avatars grouped together in a stack.
 */
declare const AvatarGroup: _chakra_ui_system.ComponentWithAs<"div", AvatarGroupProps>;

export { AvatarGroup, AvatarGroupProps };

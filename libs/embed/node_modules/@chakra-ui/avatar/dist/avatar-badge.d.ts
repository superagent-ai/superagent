import * as _chakra_ui_system from '@chakra-ui/system';
import { HTMLChakraProps } from '@chakra-ui/system';

type BadgePlacement = "top-start" | "top-end" | "bottom-start" | "bottom-end";
interface AvatarBadgeProps extends HTMLChakraProps<"div"> {
    placement?: BadgePlacement;
}
/**
 * AvatarBadge used to show extra badge to the top-right
 * or bottom-right corner of an avatar.
 */
declare const AvatarBadge: _chakra_ui_system.ComponentWithAs<"div", AvatarBadgeProps>;

export { AvatarBadge, AvatarBadgeProps };

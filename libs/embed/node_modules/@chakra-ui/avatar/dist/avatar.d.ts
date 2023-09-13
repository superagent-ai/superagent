import * as _chakra_ui_system from '@chakra-ui/system';
import { SystemStyleObject, HTMLChakraProps, ThemingProps } from '@chakra-ui/system';
import { AvatarOptions } from './avatar-types.js';

declare const baseStyle: SystemStyleObject;
interface AvatarProps extends Omit<HTMLChakraProps<"span">, "onError">, AvatarOptions, ThemingProps<"Avatar"> {
    crossOrigin?: HTMLChakraProps<"img">["crossOrigin"];
    iconLabel?: string;
    /**
     * If `true`, opt out of the avatar's `fallback` logic and
     * renders the `img` at all times.
     *
     * @default false
     */
    ignoreFallback?: boolean;
}
/**
 * Avatar component that renders an user avatar with
 * support for fallback avatar and name-only avatars
 */
declare const Avatar: _chakra_ui_system.ComponentWithAs<"span", AvatarProps>;

export { Avatar, AvatarProps, baseStyle };

import { HTMLChakraProps } from '@chakra-ui/system';
import { AvatarOptions } from './avatar-types.js';

declare function initials(name: string): string;
interface AvatarNameProps extends HTMLChakraProps<"div">, Pick<AvatarOptions, "name" | "getInitials"> {
}
/**
 * The avatar name container
 */
declare function AvatarName(props: AvatarNameProps): JSX.Element;
declare namespace AvatarName {
    var displayName: string;
}

export { AvatarName, initials };

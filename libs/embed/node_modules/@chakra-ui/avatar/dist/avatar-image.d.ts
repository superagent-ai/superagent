import { ImageProps } from '@chakra-ui/image';
import { SystemStyleObject } from '@chakra-ui/system';

type AvatarImageProps = ImageProps & {
    getInitials?: (name: string) => string;
    borderRadius?: SystemStyleObject["borderRadius"];
    icon: React.ReactElement;
    iconLabel?: string;
    name?: string;
};
declare function AvatarImage(props: AvatarImageProps): JSX.Element;
declare namespace AvatarImage {
    var displayName: string;
}

export { AvatarImage };

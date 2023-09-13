import { HTMLChakraProps } from '@chakra-ui/system';

interface ShapeProps extends HTMLChakraProps<"svg"> {
    size?: string | number;
    /**
     * @default false
     */
    isIndeterminate?: boolean;
}
declare const Shape: {
    (props: ShapeProps): JSX.Element;
    displayName: string;
};

export { Shape };

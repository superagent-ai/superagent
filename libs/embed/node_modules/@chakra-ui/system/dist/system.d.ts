import { SystemStyleObject, StyleProps } from '@chakra-ui/styled-system';
import { Dict } from '@chakra-ui/utils';
import { CSSObject, FunctionInterpolation } from '@emotion/styled';
import { As, ChakraComponent, PropsOf, ChakraProps } from './system.types.js';
import { DOMElements } from './system.utils.js';
import '@emotion/react';

type StyleResolverProps = SystemStyleObject & {
    __css?: SystemStyleObject;
    sx?: SystemStyleObject;
    theme: any;
    css?: CSSObject;
};
interface GetStyleObject {
    (options: {
        baseStyle?: SystemStyleObject | ((props: StyleResolverProps) => SystemStyleObject);
    }): FunctionInterpolation<StyleResolverProps>;
}
/**
 * Style resolver function that manages how style props are merged
 * in combination with other possible ways of defining styles.
 *
 * For example, take a component defined this way:
 * ```jsx
 * <Box fontSize="24px" sx={{ fontSize: "40px" }}></Box>
 * ```
 *
 * We want to manage the priority of the styles properly to prevent unwanted
 * behaviors. Right now, the `sx` prop has the highest priority so the resolved
 * fontSize will be `40px`
 */
declare const toCSSObject: GetStyleObject;
interface ChakraStyledOptions extends Dict {
    shouldForwardProp?(prop: string): boolean;
    label?: string;
    baseStyle?: SystemStyleObject | ((props: StyleResolverProps) => SystemStyleObject);
}
declare function styled<T extends As, P extends object = {}>(component: T, options?: ChakraStyledOptions): ChakraComponent<T, P>;
type HTMLChakraComponents = {
    [Tag in DOMElements]: ChakraComponent<Tag, {}>;
};
type HTMLChakraProps<T extends As> = Omit<PropsOf<T>, "ref" | keyof StyleProps> & ChakraProps & {
    as?: As;
};

export { ChakraStyledOptions, HTMLChakraComponents, HTMLChakraProps, styled, toCSSObject };

import { StyleFunctionProps, SystemStyleInterpolation, SystemStyleObject } from '@chakra-ui/styled-system';
export { MultiStyleConfig, PartsStyleFunction, PartsStyleInterpolation, PartsStyleObject, StyleConfig, StyleFunctionProps, SystemStyleFunction, SystemStyleInterpolation, SystemStyleObject } from '@chakra-ui/styled-system';

type GlobalStyleProps = StyleFunctionProps;
type GlobalStyles = {
    global?: SystemStyleInterpolation;
};
type JSXElementStyles = {
    [K in keyof JSX.IntrinsicElements]?: SystemStyleObject;
};
type Styles = GlobalStyles & JSXElementStyles;
declare function mode<T>(light: T, dark: T): (props: Record<string, any> | StyleFunctionProps) => T;
declare function orient<T>(options: {
    orientation?: "vertical" | "horizontal";
    vertical: T;
    horizontal: T;
}): T | {};

export { GlobalStyleProps, GlobalStyles, JSXElementStyles, Styles, mode, orient };

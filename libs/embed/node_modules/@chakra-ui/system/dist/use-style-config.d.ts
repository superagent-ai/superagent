import { ThemingProps, SystemStyleObject } from '@chakra-ui/styled-system';
import { Dict } from '@chakra-ui/utils';

declare function useStyleConfig(themeKey: string, props?: ThemingProps & Dict): SystemStyleObject;
declare function useMultiStyleConfig(themeKey: string, props?: ThemingProps & Dict): Record<string, SystemStyleObject>;
type MultipartStyles = Record<string, SystemStyleObject>;
declare function useComponentStyles__unstable(themeKey: string, props: ThemingProps & {
    baseConfig: any;
}): MultipartStyles;

export { useComponentStyles__unstable, useMultiStyleConfig, useStyleConfig };

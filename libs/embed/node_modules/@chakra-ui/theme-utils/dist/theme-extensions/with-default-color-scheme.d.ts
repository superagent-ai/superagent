import { ThemingProps } from '@chakra-ui/styled-system';
import { ThemeExtension } from '../extend-theme.js';
import '@chakra-ui/theme';

declare function withDefaultColorScheme({ colorScheme, components, }: {
    colorScheme: ThemingProps["colorScheme"];
    components?: string[] | Record<string, any>;
}): ThemeExtension;

export { withDefaultColorScheme };

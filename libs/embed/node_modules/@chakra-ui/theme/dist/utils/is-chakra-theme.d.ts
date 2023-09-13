import { ChakraTheme } from '../theme.types.js';
import '@chakra-ui/styled-system';
import '@chakra-ui/theme-tools';

declare const requiredChakraThemeKeys: (keyof ChakraTheme)[];
declare function isChakraTheme(unit: unknown): unit is ChakraTheme;

export { isChakraTheme, requiredChakraThemeKeys };

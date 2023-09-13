import { WithCSSVar } from '@chakra-ui/styled-system';
import { Dict } from '@chakra-ui/utils';

/**
 * `useTheme` is a custom hook used to get the theme object from context.
 *
 * @see Docs https://chakra-ui.com/docs/hooks/use-theme
 */
declare function useTheme<T extends object = Dict>(): WithCSSVar<T>;

export { useTheme };

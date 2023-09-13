import { ThemingProps } from '@chakra-ui/styled-system';
import { ThemeExtension } from '../extend-theme.js';
import '@chakra-ui/theme';

declare function withDefaultVariant({ variant, components, }: {
    variant: ThemingProps["variant"];
    components?: string[] | Record<string, any>;
}): ThemeExtension;

export { withDefaultVariant };

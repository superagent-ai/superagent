import * as _chakra_ui_color_mode from '@chakra-ui/color-mode';
import { Dict, StringOrNumber } from '@chakra-ui/utils';

declare function useChakra<T extends Dict = Dict>(): {
    theme: T;
    forced?: boolean | undefined;
    colorMode: _chakra_ui_color_mode.ColorMode;
    toggleColorMode: () => void;
    setColorMode: (value: any) => void;
};
/**
 * `useToken` is a custom hook used to resolve design tokens from the theme.
 *
 * @see Docs https://chakra-ui.com/docs/hooks/use-token
 */
declare function useToken<T extends StringOrNumber | StringOrNumber[]>(scale: string, token: T, fallback?: T): T;
declare function getToken<T extends StringOrNumber | StringOrNumber[]>(scale: string, token: T, fallback?: T): (theme: Dict) => T;

export { getToken, useChakra, useToken };

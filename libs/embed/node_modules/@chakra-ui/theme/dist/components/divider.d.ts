import * as _chakra_ui_styled_system from '@chakra-ui/styled-system';

declare const dividerTheme: {
    baseStyle?: {
        opacity: number;
        borderColor: string;
    } | undefined;
    sizes?: {
        [key: string]: _chakra_ui_styled_system.SystemStyleInterpolation;
    } | undefined;
    variants?: {
        solid: {
            borderStyle: string;
        };
        dashed: {
            borderStyle: string;
        };
    } | undefined;
    defaultProps?: {
        size?: string | number | undefined;
        variant?: "dashed" | "solid" | undefined;
        colorScheme?: string | undefined;
    } | undefined;
};

export { dividerTheme };

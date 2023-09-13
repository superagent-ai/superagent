import * as _chakra_ui_styled_system from '@chakra-ui/styled-system';

declare const headingTheme: {
    baseStyle?: {
        fontFamily: string;
        fontWeight: string;
    } | undefined;
    sizes?: {
        "4xl": {
            fontSize: (string | null)[];
            lineHeight: number;
        };
        "3xl": {
            fontSize: (string | null)[];
            lineHeight: number;
        };
        "2xl": {
            fontSize: (string | null)[];
            lineHeight: (number | null)[];
        };
        xl: {
            fontSize: (string | null)[];
            lineHeight: (number | null)[];
        };
        lg: {
            fontSize: (string | null)[];
            lineHeight: (number | null)[];
        };
        md: {
            fontSize: string;
            lineHeight: number;
        };
        sm: {
            fontSize: string;
            lineHeight: number;
        };
        xs: {
            fontSize: string;
            lineHeight: number;
        };
    } | undefined;
    variants?: {
        [key: string]: _chakra_ui_styled_system.SystemStyleInterpolation;
    } | undefined;
    defaultProps?: {
        size?: "md" | "xs" | "sm" | "lg" | "xl" | "2xl" | "3xl" | "4xl" | undefined;
        variant?: string | number | undefined;
        colorScheme?: string | undefined;
    } | undefined;
};

export { headingTheme };

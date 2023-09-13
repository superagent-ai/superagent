import * as _chakra_ui_styled_system from '@chakra-ui/styled-system';

declare const pinInputTheme: {
    baseStyle?: {
        textAlign: string;
        width?: string | undefined;
        height?: string | undefined;
        fontSize?: string | undefined;
        px?: string | undefined;
        borderRadius?: string | undefined;
        minWidth?: number | undefined;
        outline?: number | undefined;
        position?: string | undefined;
        appearance?: string | undefined;
        transitionProperty?: string | undefined;
        transitionDuration?: string | undefined;
        _disabled?: {
            opacity: number;
            cursor: string;
        } | undefined;
    } | undefined;
    sizes?: {
        lg: {
            fontSize: string;
            w: number;
            h: number;
            borderRadius: string;
        };
        md: {
            fontSize: string;
            w: number;
            h: number;
            borderRadius: string;
        };
        sm: {
            fontSize: string;
            w: number;
            h: number;
            borderRadius: string;
        };
        xs: {
            fontSize: string;
            w: number;
            h: number;
            borderRadius: string;
        };
    } | undefined;
    variants?: {
        outline: (props: _chakra_ui_styled_system.StyleFunctionProps) => {};
        flushed: (props: _chakra_ui_styled_system.StyleFunctionProps) => {};
        filled: (props: _chakra_ui_styled_system.StyleFunctionProps) => {};
        unstyled: {};
    } | undefined;
    defaultProps?: {
        size?: "md" | "xs" | "sm" | "lg" | undefined;
        variant?: "outline" | "filled" | "unstyled" | "flushed" | undefined;
        colorScheme?: string | undefined;
    } | undefined;
};

export { pinInputTheme };

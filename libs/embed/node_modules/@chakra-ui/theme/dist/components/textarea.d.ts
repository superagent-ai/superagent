import * as _chakra_ui_styled_system from '@chakra-ui/styled-system';

declare const textareaTheme: {
    baseStyle?: {
        paddingY: string;
        minHeight: string;
        lineHeight: string;
        verticalAlign: string;
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
        xs: {
            [x: string]: string;
        };
        sm: {
            [x: string]: string;
        };
        md: {
            [x: string]: string;
        };
        lg: {
            [x: string]: string;
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

export { textareaTheme };

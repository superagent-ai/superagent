import * as _chakra_ui_styled_system from '@chakra-ui/styled-system';

declare const codeTheme: {
    baseStyle?: {
        fontFamily: string;
        fontSize: string;
        px: string;
        borderRadius: string;
        bg: string;
        color: string;
        boxShadow: string;
    } | undefined;
    sizes?: {
        [x: string]: {};
    } | undefined;
    variants?: {
        solid: (props: _chakra_ui_styled_system.StyleFunctionProps) => {
            [x: string]: string | {
                [x: string]: string;
            };
            _dark: {
                [x: string]: string;
            };
        };
        subtle: (props: _chakra_ui_styled_system.StyleFunctionProps) => {
            [x: string]: string | {
                [x: string]: string;
            };
            _dark: {
                [x: string]: string;
            };
        };
        outline: (props: _chakra_ui_styled_system.StyleFunctionProps) => {
            [x: string]: string | {
                [x: string]: string;
            };
            _dark: {
                [x: string]: string;
            };
        };
    } | undefined;
    defaultProps?: {
        size?: string | number | undefined;
        variant?: "outline" | "solid" | "subtle" | undefined;
        colorScheme?: string | undefined;
    } | undefined;
};

export { codeTheme };

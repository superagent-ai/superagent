import * as _chakra_ui_styled_system from '@chakra-ui/styled-system';

declare const tagTheme: {
    baseStyle?: {
        container: {
            [x: string]: string | number | {
                [x: string]: string;
            };
            fontWeight: string;
            lineHeight: number;
            outline: number;
            color: string;
            bg: string;
            boxShadow: string;
            borderRadius: string;
            minH: string;
            minW: string;
            fontSize: string;
            px: string;
            _focusVisible: {
                [x: string]: string;
            };
        };
        label: {
            lineHeight: number;
            overflow: string;
        };
        closeButton: {
            fontSize: string;
            w: string;
            h: string;
            transitionProperty: string;
            transitionDuration: string;
            borderRadius: string;
            marginStart: string;
            marginEnd: string;
            opacity: number;
            _disabled: {
                opacity: number;
            };
            _focusVisible: {
                boxShadow: string;
                bg: string;
            };
            _hover: {
                opacity: number;
            };
            _active: {
                opacity: number;
            };
        };
    } | undefined;
    sizes?: {
        sm: {
            container: {
                [x: string]: string;
            };
            closeButton: {
                marginEnd: string;
                marginStart: string;
            };
        };
        md: {
            container: {
                [x: string]: string;
            };
        };
        lg: {
            container: {
                [x: string]: string;
            };
        };
    } | undefined;
    variants?: {
        subtle: (props: _chakra_ui_styled_system.StyleFunctionProps) => {
            container: {
                [x: string]: string | {
                    [x: string]: string;
                };
                _dark: {
                    [x: string]: string;
                };
            } | undefined;
        };
        solid: (props: _chakra_ui_styled_system.StyleFunctionProps) => {
            container: {
                [x: string]: string | {
                    [x: string]: string;
                };
                _dark: {
                    [x: string]: string;
                };
            } | undefined;
        };
        outline: (props: _chakra_ui_styled_system.StyleFunctionProps) => {
            container: {
                [x: string]: string | {
                    [x: string]: string;
                };
                _dark: {
                    [x: string]: string;
                };
            } | undefined;
        };
    } | undefined;
    defaultProps?: {
        size?: "md" | "sm" | "lg" | undefined;
        variant?: "outline" | "solid" | "subtle" | undefined;
        colorScheme?: string | undefined;
    } | undefined;
    parts: ("container" | "label" | "closeButton")[];
};

export { tagTheme };

import * as _chakra_ui_styled_system from '@chakra-ui/styled-system';
import { StyleFunctionProps } from '@chakra-ui/styled-system';

declare const alertTheme: {
    baseStyle?: {
        container: {
            bg: string;
            px: string;
            py: string;
        };
        title: {
            fontWeight: string;
            lineHeight: string;
            marginEnd: string;
        };
        description: {
            lineHeight: string;
        };
        icon: {
            color: string;
            flexShrink: number;
            marginEnd: string;
            w: string;
            h: string;
        };
        spinner: {
            color: string;
            flexShrink: number;
            marginEnd: string;
            w: string;
            h: string;
        };
    } | undefined;
    sizes?: {
        [key: string]: _chakra_ui_styled_system.PartsStyleInterpolation<{
            keys: ("container" | "icon" | "spinner" | "title" | "description")[];
        }>;
    } | undefined;
    variants?: {
        subtle: (props: StyleFunctionProps) => {
            container: {
                [x: string]: string | {
                    [x: string]: string;
                };
                _dark: {
                    [x: string]: string;
                };
            };
        };
        "left-accent": (props: StyleFunctionProps) => {
            container: {
                [x: string]: string | {
                    [x: string]: string;
                };
                _dark: {
                    [x: string]: string;
                };
                paddingStart: string;
                borderStartWidth: string;
                borderStartColor: string;
            };
        };
        "top-accent": (props: StyleFunctionProps) => {
            container: {
                [x: string]: string | {
                    [x: string]: string;
                };
                _dark: {
                    [x: string]: string;
                };
                pt: string;
                borderTopWidth: string;
                borderTopColor: string;
            };
        };
        solid: (props: StyleFunctionProps) => {
            container: {
                [x: string]: string | {
                    [x: string]: string;
                };
                _dark: {
                    [x: string]: string;
                };
                color: string;
            };
        };
    } | undefined;
    defaultProps?: {
        size?: string | number | undefined;
        variant?: "solid" | "subtle" | "left-accent" | "top-accent" | undefined;
        colorScheme?: string | undefined;
    } | undefined;
    parts: ("container" | "icon" | "spinner" | "title" | "description")[];
};

export { alertTheme };

import * as _chakra_ui_styled_system from '@chakra-ui/styled-system';

declare const closeButtonTheme: {
    baseStyle?: {
        w: string[];
        h: string[];
        borderRadius: string;
        transitionProperty: string;
        transitionDuration: string;
        _disabled: {
            opacity: number;
            cursor: string;
            boxShadow: string;
        };
        _hover: {
            [x: string]: string | {
                [x: string]: string;
            };
            _dark: {
                [x: string]: string;
            };
        };
        _active: {
            [x: string]: string | {
                [x: string]: string;
            };
            _dark: {
                [x: string]: string;
            };
        };
        _focusVisible: {
            boxShadow: string;
        };
        bg: string;
    } | undefined;
    sizes?: {
        lg: {
            [x: string]: string;
            fontSize: string;
        };
        md: {
            [x: string]: string;
            fontSize: string;
        };
        sm: {
            [x: string]: string;
            fontSize: string;
        };
    } | undefined;
    variants?: {
        [key: string]: _chakra_ui_styled_system.SystemStyleInterpolation;
    } | undefined;
    defaultProps?: {
        size?: "md" | "sm" | "lg" | undefined;
        variant?: string | number | undefined;
        colorScheme?: string | undefined;
    } | undefined;
};

export { closeButtonTheme };

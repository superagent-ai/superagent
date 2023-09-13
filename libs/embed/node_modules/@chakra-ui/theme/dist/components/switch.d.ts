import * as _chakra_ui_styled_system from '@chakra-ui/styled-system';

declare const switchTheme: {
    baseStyle?: ((props: _chakra_ui_styled_system.StyleFunctionProps) => {
        container: {
            [x: string]: string | {
                [x: string]: string;
            };
            _rtl: {
                [x: string]: string;
            };
        };
        track: {
            [x: string]: string | string[] | {
                [x: string]: string;
                boxShadow?: undefined;
                opacity?: undefined;
                cursor?: undefined;
                _dark?: undefined;
            } | {
                boxShadow: string;
                opacity?: undefined;
                cursor?: undefined;
                _dark?: undefined;
            } | {
                opacity: number;
                cursor: string;
                boxShadow?: undefined;
                _dark?: undefined;
            } | {
                [x: string]: string | {
                    [x: string]: string;
                };
                _dark: {
                    [x: string]: string;
                };
                boxShadow?: undefined;
                opacity?: undefined;
                cursor?: undefined;
            };
            borderRadius: string;
            p: string;
            width: string[];
            height: string[];
            transitionProperty: string;
            transitionDuration: string;
            _dark: {
                [x: string]: string;
            };
            _focusVisible: {
                boxShadow: string;
            };
            _disabled: {
                opacity: number;
                cursor: string;
            };
            _checked: {
                [x: string]: string | {
                    [x: string]: string;
                };
                _dark: {
                    [x: string]: string;
                };
            };
            bg: string;
        };
        thumb: {
            bg: string;
            transitionProperty: string;
            transitionDuration: string;
            borderRadius: string;
            width: string[];
            height: string[];
            _checked: {
                transform: string;
            };
        };
    }) | undefined;
    sizes?: {
        sm: {
            container: {
                [x: string]: string;
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
        [key: string]: _chakra_ui_styled_system.PartsStyleInterpolation<{
            keys: ("container" | "track" | "thumb")[];
        }>;
    } | undefined;
    defaultProps?: {
        size?: "md" | "sm" | "lg" | undefined;
        variant?: string | number | undefined;
        colorScheme?: string | undefined;
    } | undefined;
    parts: ("container" | "track" | "thumb")[];
};

export { switchTheme };

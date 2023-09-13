import * as _chakra_ui_styled_system from '@chakra-ui/styled-system';

declare const sliderTheme: {
    baseStyle?: ((props: _chakra_ui_styled_system.StyleFunctionProps) => {
        container: {
            h: string;
            w?: undefined;
            display: string;
            position: string;
            cursor: string;
            _disabled: {
                opacity: number;
                cursor: string;
                pointerEvents: string;
            };
        } | {
            w: string;
            h?: undefined;
            display: string;
            position: string;
            cursor: string;
            _disabled: {
                opacity: number;
                cursor: string;
                pointerEvents: string;
            };
        } | {
            display: string;
            position: string;
            cursor: string;
            _disabled: {
                opacity: number;
                cursor: string;
                pointerEvents: string;
            };
        };
        track: {
            overflow: string;
            borderRadius: string;
            _dark: {
                [x: string]: string;
            };
            _disabled: {
                [x: string]: string | {
                    [x: string]: string;
                };
                _dark: {
                    [x: string]: string;
                };
            };
            bg: string;
            h: string;
            w?: undefined;
        } | {
            overflow: string;
            borderRadius: string;
            _dark: {
                [x: string]: string;
            };
            _disabled: {
                [x: string]: string | {
                    [x: string]: string;
                };
                _dark: {
                    [x: string]: string;
                };
            };
            bg: string;
            w: string;
            h?: undefined;
        } | {
            overflow: string;
            borderRadius: string;
            _dark: {
                [x: string]: string;
            };
            _disabled: {
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
            w: string;
            h: string;
            display: string;
            alignItems: string;
            justifyContent: string;
            position: string;
            outline: number;
            zIndex: number;
            borderRadius: string;
            bg: string;
            boxShadow: string;
            border: string;
            borderColor: string;
            transitionProperty: string;
            transitionDuration: string;
            _focusVisible: {
                boxShadow: string;
            };
            _disabled: {
                bg: string;
            };
            left: string;
            transform: string;
            _active: {
                transform: string;
            };
            top?: undefined;
        } | {
            w: string;
            h: string;
            display: string;
            alignItems: string;
            justifyContent: string;
            position: string;
            outline: number;
            zIndex: number;
            borderRadius: string;
            bg: string;
            boxShadow: string;
            border: string;
            borderColor: string;
            transitionProperty: string;
            transitionDuration: string;
            _focusVisible: {
                boxShadow: string;
            };
            _disabled: {
                bg: string;
            };
            top: string;
            transform: string;
            _active: {
                transform: string;
            };
            left?: undefined;
        } | {
            w: string;
            h: string;
            display: string;
            alignItems: string;
            justifyContent: string;
            position: string;
            outline: number;
            zIndex: number;
            borderRadius: string;
            bg: string;
            boxShadow: string;
            border: string;
            borderColor: string;
            transitionProperty: string;
            transitionDuration: string;
            _focusVisible: {
                boxShadow: string;
            };
            _disabled: {
                bg: string;
            };
        };
        filledTrack: {
            [x: string]: string | {
                [x: string]: string;
            };
            width: string;
            height: string;
            _dark: {
                [x: string]: string;
            };
            bg: string;
        };
    }) | undefined;
    sizes?: {
        lg: {
            container: {
                [x: string]: string;
            };
        };
        md: {
            container: {
                [x: string]: string;
            };
        };
        sm: {
            container: {
                [x: string]: string;
            };
        };
    } | undefined;
    variants?: {
        [key: string]: _chakra_ui_styled_system.PartsStyleInterpolation<{
            keys: ("container" | "filledTrack" | "track" | "thumb" | "mark")[];
        }>;
    } | undefined;
    defaultProps?: {
        size?: "md" | "sm" | "lg" | undefined;
        variant?: string | number | undefined;
        colorScheme?: string | undefined;
    } | undefined;
    parts: ("container" | "filledTrack" | "track" | "thumb" | "mark")[];
};

export { sliderTheme };

import * as _chakra_ui_styled_system from '@chakra-ui/styled-system';

declare const formErrorTheme: {
    baseStyle?: {
        text: {
            [x: string]: string | {
                [x: string]: string;
            };
            _dark: {
                [x: string]: string;
            };
            color: string;
            mt: string;
            fontSize: string;
            lineHeight: string;
        };
        icon: {
            [x: string]: string | {
                [x: string]: string;
            };
            marginEnd: string;
            _dark: {
                [x: string]: string;
            };
            color: string;
        };
    } | undefined;
    sizes?: {
        [key: string]: _chakra_ui_styled_system.PartsStyleInterpolation<{
            keys: ("icon" | "text")[];
        }>;
    } | undefined;
    variants?: {
        [key: string]: _chakra_ui_styled_system.PartsStyleInterpolation<{
            keys: ("icon" | "text")[];
        }>;
    } | undefined;
    defaultProps?: {
        size?: string | number | undefined;
        variant?: string | number | undefined;
        colorScheme?: string | undefined;
    } | undefined;
    parts: ("icon" | "text")[];
};

export { formErrorTheme };

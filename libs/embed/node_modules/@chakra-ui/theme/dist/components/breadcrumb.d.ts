import * as _chakra_ui_styled_system from '@chakra-ui/styled-system';

declare const breadcrumbTheme: {
    baseStyle?: {
        link: {
            [x: string]: string | {
                cursor: string;
                _hover: {
                    [x: string]: string;
                };
                _focusVisible: {
                    boxShadow: string;
                };
            };
            transitionProperty: string;
            transitionDuration: string;
            transitionTimingFunction: string;
            outline: string;
            color: string;
            textDecoration: string;
            "&:not([aria-current=page])": {
                cursor: string;
                _hover: {
                    [x: string]: string;
                };
                _focusVisible: {
                    boxShadow: string;
                };
            };
        };
    } | undefined;
    sizes?: {
        [key: string]: _chakra_ui_styled_system.PartsStyleInterpolation<{
            keys: ("link" | "container" | "separator" | "item")[];
        }>;
    } | undefined;
    variants?: {
        [key: string]: _chakra_ui_styled_system.PartsStyleInterpolation<{
            keys: ("link" | "container" | "separator" | "item")[];
        }>;
    } | undefined;
    defaultProps?: {
        size?: string | number | undefined;
        variant?: string | number | undefined;
        colorScheme?: string | undefined;
    } | undefined;
    parts: ("link" | "container" | "separator" | "item")[];
};

export { breadcrumbTheme };

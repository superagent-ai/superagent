import * as _chakra_ui_styled_system from '@chakra-ui/styled-system';

declare const listTheme: {
    baseStyle?: {
        icon: {
            marginEnd: string;
            display: string;
            verticalAlign: string;
        };
    } | undefined;
    sizes?: {
        [key: string]: _chakra_ui_styled_system.PartsStyleInterpolation<{
            keys: ("container" | "icon" | "item")[];
        }>;
    } | undefined;
    variants?: {
        [key: string]: _chakra_ui_styled_system.PartsStyleInterpolation<{
            keys: ("container" | "icon" | "item")[];
        }>;
    } | undefined;
    defaultProps?: {
        size?: string | number | undefined;
        variant?: string | number | undefined;
        colorScheme?: string | undefined;
    } | undefined;
    parts: ("container" | "icon" | "item")[];
};

export { listTheme };

import * as _chakra_ui_styled_system from '@chakra-ui/styled-system';

declare const statTheme: {
    baseStyle?: {
        container: {};
        label: {
            fontWeight: string;
        };
        helpText: {
            opacity: number;
            marginBottom: string;
        };
        number: {
            verticalAlign: string;
            fontWeight: string;
        };
        icon: {
            marginEnd: number;
            w: string;
            h: string;
            verticalAlign: string;
        };
    } | undefined;
    sizes?: {
        md: {
            label: {
                fontSize: string;
            };
            helpText: {
                fontSize: string;
            };
            number: {
                fontSize: string;
            };
        };
    } | undefined;
    variants?: {
        [key: string]: _chakra_ui_styled_system.PartsStyleInterpolation<{
            keys: ("number" | "container" | "icon" | "label" | "helpText")[];
        }>;
    } | undefined;
    defaultProps?: {
        size?: "md" | undefined;
        variant?: string | number | undefined;
        colorScheme?: string | undefined;
    } | undefined;
    parts: ("number" | "container" | "icon" | "label" | "helpText")[];
};

export { statTheme };

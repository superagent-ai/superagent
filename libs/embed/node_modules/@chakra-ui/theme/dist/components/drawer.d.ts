import * as _chakra_ui_styled_system from '@chakra-ui/styled-system';

declare const drawerTheme: {
    baseStyle?: ((props: _chakra_ui_styled_system.StyleFunctionProps) => {
        overlay: {
            bg: string;
            zIndex: string;
        };
        dialogContainer: {
            display: string;
            zIndex: string;
            justifyContent: string;
        };
        dialog: any;
        header: {
            px: string;
            py: string;
            fontSize: string;
            fontWeight: string;
        };
        closeButton: {
            position: string;
            top: string;
            insetEnd: string;
        };
        body: {
            px: string;
            py: string;
            flex: string;
            overflow: string;
        };
        footer: {
            px: string;
            py: string;
        };
    }) | undefined;
    sizes?: {
        xs: {
            dialog: {
                maxW: string;
            };
        };
        sm: {
            dialog: {
                maxW: string;
            };
        };
        md: {
            dialog: {
                maxW: string;
            };
        };
        lg: {
            dialog: {
                maxW: string;
            };
        };
        xl: {
            dialog: {
                maxW: string;
            };
        };
        full: {
            dialog: {
                maxW: string;
            };
        };
    } | undefined;
    variants?: {
        [key: string]: _chakra_ui_styled_system.PartsStyleInterpolation<{
            keys: ("overlay" | "dialogContainer" | "dialog" | "header" | "closeButton" | "body" | "footer")[];
        }>;
    } | undefined;
    defaultProps?: {
        size?: "md" | "full" | "xs" | "sm" | "lg" | "xl" | undefined;
        variant?: string | number | undefined;
        colorScheme?: string | undefined;
    } | undefined;
    parts: ("overlay" | "dialogContainer" | "dialog" | "header" | "closeButton" | "body" | "footer")[];
};

export { drawerTheme };

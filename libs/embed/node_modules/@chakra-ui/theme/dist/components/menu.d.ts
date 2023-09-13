import * as _chakra_ui_styled_system from '@chakra-ui/styled-system';

declare const menuTheme: {
    baseStyle?: {
        button: {
            transitionProperty: string;
            transitionDuration: string;
        };
        list: {
            [x: string]: string | number | {
                [x: string]: string;
            };
            _dark: {
                [x: string]: string;
            };
            color: string;
            minW: string;
            py: string;
            zIndex: number;
            borderRadius: string;
            borderWidth: string;
            bg: string;
            boxShadow: string;
        };
        item: {
            py: string;
            px: string;
            transitionProperty: string;
            transitionDuration: string;
            transitionTimingFunction: string;
            _focus: {
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
            _expanded: {
                [x: string]: string | {
                    [x: string]: string;
                };
                _dark: {
                    [x: string]: string;
                };
            };
            _disabled: {
                opacity: number;
                cursor: string;
            };
            bg: string;
        };
        groupTitle: {
            mx: number;
            my: number;
            fontWeight: string;
            fontSize: string;
        };
        icon: {
            display: string;
            alignItems: string;
            justifyContent: string;
            flexShrink: number;
        };
        command: {
            opacity: number;
        };
        divider: {
            border: number;
            borderBottom: string;
            borderColor: string;
            my: string;
            opacity: number;
        };
    } | undefined;
    sizes?: {
        [key: string]: _chakra_ui_styled_system.PartsStyleInterpolation<{
            keys: ("button" | "icon" | "item" | "list" | "groupTitle" | "command" | "divider")[];
        }>;
    } | undefined;
    variants?: {
        [key: string]: _chakra_ui_styled_system.PartsStyleInterpolation<{
            keys: ("button" | "icon" | "item" | "list" | "groupTitle" | "command" | "divider")[];
        }>;
    } | undefined;
    defaultProps?: {
        size?: string | number | undefined;
        variant?: string | number | undefined;
        colorScheme?: string | undefined;
    } | undefined;
    parts: ("button" | "icon" | "item" | "list" | "groupTitle" | "command" | "divider")[];
};

export { menuTheme };

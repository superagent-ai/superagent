import * as _chakra_ui_styled_system from '@chakra-ui/styled-system';

declare const checkboxTheme: {
    baseStyle?: ((props: _chakra_ui_styled_system.StyleFunctionProps) => {
        icon: {
            transitionProperty: string;
            transitionDuration: string;
        };
        container: {
            _disabled: {
                cursor: string;
            };
        };
        control: {
            w: string;
            h: string;
            transitionProperty: string;
            transitionDuration: string;
            border: string;
            borderRadius: string;
            borderColor: string;
            color: string;
            _checked: {
                bg: string;
                borderColor: string;
                color: string;
                _hover: {
                    bg: string;
                    borderColor: string;
                };
                _disabled: {
                    borderColor: string;
                    bg: string;
                    color: string;
                };
            };
            _indeterminate: {
                bg: string;
                borderColor: string;
                color: string;
            };
            _disabled: {
                bg: string;
                borderColor: string;
            };
            _focusVisible: {
                boxShadow: string;
            };
            _invalid: {
                borderColor: string;
            };
        };
        label: {
            userSelect: string;
            _disabled: {
                opacity: number;
            };
        };
    }) | undefined;
    sizes?: {
        sm: {
            control: {
                [x: string]: string;
            };
            label: {
                fontSize: string;
            };
            icon: {
                fontSize: string;
            };
        };
        md: {
            control: {
                [x: string]: string;
            };
            label: {
                fontSize: string;
            };
            icon: {
                fontSize: string;
            };
        };
        lg: {
            control: {
                [x: string]: string;
            };
            label: {
                fontSize: string;
            };
            icon: {
                fontSize: string;
            };
        };
    } | undefined;
    variants?: {
        [key: string]: _chakra_ui_styled_system.PartsStyleInterpolation<{
            keys: ("container" | "icon" | "label" | "control")[];
        }>;
    } | undefined;
    defaultProps?: {
        size?: "md" | "sm" | "lg" | undefined;
        variant?: string | number | undefined;
        colorScheme?: string | undefined;
    } | undefined;
    parts: ("container" | "icon" | "label" | "control")[];
};

export { checkboxTheme };

import * as _chakra_ui_styled_system from '@chakra-ui/styled-system';

declare const radioTheme: {
    baseStyle?: ((props: _chakra_ui_styled_system.StyleFunctionProps) => {
        label: {
            userSelect: string;
            _disabled: {
                opacity: number;
            };
        } | undefined;
        container: {
            _disabled: {
                cursor: string;
            };
        } | undefined;
        control: {
            borderRadius: string;
            _checked: {
                _before: {
                    content: string;
                    display: string;
                    pos: string;
                    w: string;
                    h: string;
                    borderRadius: string;
                    bg: string;
                };
                bg?: string | undefined;
                borderColor?: string | undefined;
                color?: string | undefined;
                _hover?: {
                    bg: string;
                    borderColor: string;
                } | undefined;
                _disabled?: {
                    borderColor: string;
                    bg: string;
                    color: string;
                } | undefined;
            };
            w?: string | undefined;
            h?: string | undefined;
            transitionProperty?: string | undefined;
            transitionDuration?: string | undefined;
            border?: string | undefined;
            borderColor?: string | undefined;
            color?: string | undefined;
            _indeterminate?: {
                bg: string;
                borderColor: string;
                color: string;
            } | undefined;
            _disabled?: {
                bg: string;
                borderColor: string;
            } | undefined;
            _focusVisible?: {
                boxShadow: string;
            } | undefined;
            _invalid?: {
                borderColor: string;
            } | undefined;
        };
    }) | undefined;
    sizes?: {
        md: {
            control: {
                w: string;
                h: string;
            };
            label: {
                fontSize: string;
            };
        };
        lg: {
            control: {
                w: string;
                h: string;
            };
            label: {
                fontSize: string;
            };
        };
        sm: {
            control: {
                width: string;
                height: string;
            };
            label: {
                fontSize: string;
            };
        };
    } | undefined;
    variants?: {
        [key: string]: _chakra_ui_styled_system.PartsStyleInterpolation<{
            keys: ("container" | "label" | "control")[];
        }>;
    } | undefined;
    defaultProps?: {
        size?: "md" | "sm" | "lg" | undefined;
        variant?: string | number | undefined;
        colorScheme?: string | undefined;
    } | undefined;
    parts: ("container" | "label" | "control")[];
};

export { radioTheme };

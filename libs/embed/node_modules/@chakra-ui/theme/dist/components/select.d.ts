import * as _chakra_ui_styled_system from '@chakra-ui/styled-system';

declare const selectTheme: {
    baseStyle?: {
        field: {
            appearance: string;
            paddingBottom: string;
            lineHeight: string;
            bg: string;
            _dark: {
                [x: string]: string;
            };
            "> option, > optgroup": {
                bg: string;
            };
            width?: string | undefined;
            height?: string | undefined;
            fontSize?: string | undefined;
            px?: string | undefined;
            borderRadius?: string | undefined;
            minWidth?: number | undefined;
            outline?: number | undefined;
            position?: string | undefined;
            transitionProperty?: string | undefined;
            transitionDuration?: string | undefined;
            _disabled?: {
                opacity: number;
                cursor: string;
            } | undefined;
        };
        icon: {
            width: string;
            height: string;
            insetEnd: string;
            position: string;
            color: string;
            fontSize: string;
            _disabled: {
                opacity: number;
            };
        };
    } | undefined;
    sizes?: {
        lg: {
            field: {
                paddingInlineEnd: string;
            };
            group?: {
                [x: string]: string;
            } | undefined;
        };
        md: {
            field: {
                paddingInlineEnd: string;
            };
            group?: {
                [x: string]: string;
            } | undefined;
        };
        sm: {
            field: {
                paddingInlineEnd: string;
            };
            group?: {
                [x: string]: string;
            } | undefined;
        };
        xs: {
            field: {
                paddingInlineEnd: string;
            };
            icon: {
                insetEnd: string;
            };
            group?: {
                [x: string]: string;
            } | undefined;
        };
    } | undefined;
    variants?: {
        outline: (props: _chakra_ui_styled_system.StyleFunctionProps) => {
            field: {
                border: string;
                borderColor: string;
                bg: string;
                _hover: {
                    borderColor: string;
                };
                _readOnly: {
                    boxShadow: string;
                    userSelect: string;
                };
                _invalid: {
                    borderColor: any;
                    boxShadow: string;
                };
                _focusVisible: {
                    zIndex: number;
                    borderColor: any;
                    boxShadow: string;
                };
            };
            addon: {
                border: string;
                borderColor: string;
                bg: string;
            };
        };
        filled: (props: _chakra_ui_styled_system.StyleFunctionProps) => {
            field: {
                border: string;
                borderColor: string;
                bg: string;
                _hover: {
                    bg: string;
                };
                _readOnly: {
                    boxShadow: string;
                    userSelect: string;
                };
                _invalid: {
                    borderColor: any;
                };
                _focusVisible: {
                    bg: string;
                    borderColor: any;
                };
            };
            addon: {
                border: string;
                borderColor: string;
                bg: string;
            };
        };
        flushed: (props: _chakra_ui_styled_system.StyleFunctionProps) => {
            field: {
                borderBottom: string;
                borderColor: string;
                borderRadius: string;
                px: string;
                bg: string;
                _readOnly: {
                    boxShadow: string;
                    userSelect: string;
                };
                _invalid: {
                    borderColor: any;
                    boxShadow: string;
                };
                _focusVisible: {
                    borderColor: any;
                    boxShadow: string;
                };
            };
            addon: {
                borderBottom: string;
                borderColor: string;
                borderRadius: string;
                px: string;
                bg: string;
            };
        };
        unstyled: {
            field: {
                bg: string;
                px: string;
                height: string;
            };
            addon: {
                bg: string;
                px: string;
                height: string;
            };
        };
    } | undefined;
    defaultProps?: {
        size?: "md" | "xs" | "sm" | "lg" | undefined;
        variant?: "outline" | "filled" | "unstyled" | "flushed" | undefined;
        colorScheme?: string | undefined;
    } | undefined;
    parts: ("icon" | "field")[];
};

export { selectTheme };

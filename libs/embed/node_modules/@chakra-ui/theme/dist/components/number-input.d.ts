import * as _chakra_ui_styled_system from '@chakra-ui/styled-system';

declare const numberInputTheme: {
    baseStyle?: ((props: _chakra_ui_styled_system.StyleFunctionProps) => {
        root: {
            [x: string]: string;
        };
        field: {};
        stepperGroup: {
            width: string;
        };
        stepper: {
            [x: string]: string | {
                [x: string]: string;
                _dark?: undefined;
                opacity?: undefined;
                cursor?: undefined;
            } | {
                [x: string]: string | {
                    [x: string]: string;
                };
                _dark: {
                    [x: string]: string;
                };
                opacity?: undefined;
                cursor?: undefined;
            } | {
                opacity: number;
                cursor: string;
                _dark?: undefined;
            };
            borderStart: string;
            borderStartColor: string;
            color: string;
            bg: string;
            _dark: {
                [x: string]: string;
            };
            _active: {
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
        };
    }) | undefined;
    sizes?: {
        xs: {
            field: any;
            stepper: {
                fontSize: string;
                _first: {
                    borderTopEndRadius: string | undefined;
                };
                _last: {
                    borderBottomEndRadius: string | undefined;
                    mt: string;
                    borderTopWidth: number;
                };
            };
        };
        sm: {
            field: any;
            stepper: {
                fontSize: string;
                _first: {
                    borderTopEndRadius: string | undefined;
                };
                _last: {
                    borderBottomEndRadius: string | undefined;
                    mt: string;
                    borderTopWidth: number;
                };
            };
        };
        md: {
            field: any;
            stepper: {
                fontSize: string;
                _first: {
                    borderTopEndRadius: string | undefined;
                };
                _last: {
                    borderBottomEndRadius: string | undefined;
                    mt: string;
                    borderTopWidth: number;
                };
            };
        };
        lg: {
            field: any;
            stepper: {
                fontSize: string;
                _first: {
                    borderTopEndRadius: string | undefined;
                };
                _last: {
                    borderBottomEndRadius: string | undefined;
                    mt: string;
                    borderTopWidth: number;
                };
            };
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
    parts: ("root" | "field" | "stepperGroup" | "stepper")[];
};

export { numberInputTheme };

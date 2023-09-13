import * as _chakra_ui_styled_system from '@chakra-ui/styled-system';

declare const tabsTheme: {
    baseStyle?: ((props: _chakra_ui_styled_system.StyleFunctionProps) => {
        root: {
            display: string;
        };
        tab: {
            flex: number | undefined;
            transitionProperty: string;
            transitionDuration: string;
            _focusVisible: {
                zIndex: number;
                boxShadow: string;
            };
            _disabled: {
                cursor: string;
                opacity: number;
            };
        };
        tablist: {
            justifyContent: string;
            flexDirection: string;
        };
        tabpanel: {
            p: number;
        };
    }) | undefined;
    sizes?: {
        sm: {
            tab: {
                py: number;
                px: number;
                fontSize: string;
            };
        };
        md: {
            tab: {
                fontSize: string;
                py: number;
                px: number;
            };
        };
        lg: {
            tab: {
                fontSize: string;
                py: number;
                px: number;
            };
        };
    } | undefined;
    variants?: {
        line: (props: _chakra_ui_styled_system.StyleFunctionProps) => {
            tablist: {
                [x: string]: string;
                borderColor: string;
            };
            tab: {
                [x: string]: string | {
                    [x: string]: string | {
                        [x: string]: string;
                    };
                    _dark: {
                        [x: string]: string;
                    };
                    borderColor: string;
                    _active?: undefined;
                } | {
                    [x: string]: string | {
                        [x: string]: string;
                    };
                    _dark: {
                        [x: string]: string;
                    };
                    borderColor?: undefined;
                    _active?: undefined;
                } | {
                    _active: {
                        bg: string;
                    };
                    _dark?: undefined;
                    borderColor?: undefined;
                };
                borderColor: string;
                _selected: {
                    [x: string]: string | {
                        [x: string]: string;
                    };
                    _dark: {
                        [x: string]: string;
                    };
                    borderColor: string;
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
                    _active: {
                        bg: string;
                    };
                };
                color: string;
                bg: string;
            };
        };
        enclosed: (props: _chakra_ui_styled_system.StyleFunctionProps) => {
            tab: {
                [x: string]: string | {
                    [x: string]: string | {
                        [x: string]: string;
                    };
                    _dark: {
                        [x: string]: string;
                    };
                    borderColor: string;
                    borderBottomColor: string;
                };
                borderTopRadius: string;
                border: string;
                borderColor: string;
                mb: string;
                _selected: {
                    [x: string]: string | {
                        [x: string]: string;
                    };
                    _dark: {
                        [x: string]: string;
                    };
                    borderColor: string;
                    borderBottomColor: string;
                };
                color: string;
            };
            tablist: {
                mb: string;
                borderBottom: string;
                borderColor: string;
            };
        };
        "enclosed-colored": (props: _chakra_ui_styled_system.StyleFunctionProps) => {
            tab: {
                [x: string]: string | {
                    [x: string]: string;
                    marginEnd?: undefined;
                    _dark?: undefined;
                    borderColor?: undefined;
                    borderTopColor?: undefined;
                    borderBottomColor?: undefined;
                } | {
                    marginEnd: string;
                    _dark?: undefined;
                    borderColor?: undefined;
                    borderTopColor?: undefined;
                    borderBottomColor?: undefined;
                } | {
                    [x: string]: string | {
                        [x: string]: string;
                    };
                    _dark: {
                        [x: string]: string;
                    };
                    borderColor: string;
                    borderTopColor: string;
                    borderBottomColor: string;
                    marginEnd?: undefined;
                };
                border: string;
                borderColor: string;
                _dark: {
                    [x: string]: string;
                };
                mb: string;
                _notLast: {
                    marginEnd: string;
                };
                _selected: {
                    [x: string]: string | {
                        [x: string]: string;
                    };
                    _dark: {
                        [x: string]: string;
                    };
                    borderColor: string;
                    borderTopColor: string;
                    borderBottomColor: string;
                };
                color: string;
                bg: string;
            };
            tablist: {
                mb: string;
                borderBottom: string;
                borderColor: string;
            };
        };
        "soft-rounded": (props: _chakra_ui_styled_system.StyleFunctionProps) => {
            tab: {
                borderRadius: string;
                fontWeight: string;
                color: string;
                _selected: {
                    color: any;
                    bg: any;
                };
            };
        };
        "solid-rounded": (props: _chakra_ui_styled_system.StyleFunctionProps) => {
            tab: {
                [x: string]: string | {
                    [x: string]: string;
                    _dark?: undefined;
                } | {
                    [x: string]: string | {
                        [x: string]: string;
                    };
                    _dark: {
                        [x: string]: string;
                    };
                };
                borderRadius: string;
                fontWeight: string;
                _dark: {
                    [x: string]: string;
                };
                _selected: {
                    [x: string]: string | {
                        [x: string]: string;
                    };
                    _dark: {
                        [x: string]: string;
                    };
                };
                color: string;
                bg: string;
            };
        };
        unstyled: {};
    } | undefined;
    defaultProps?: {
        size?: "md" | "sm" | "lg" | undefined;
        variant?: "unstyled" | "line" | "enclosed" | "enclosed-colored" | "soft-rounded" | "solid-rounded" | undefined;
        colorScheme?: string | undefined;
    } | undefined;
    parts: ("root" | "tab" | "tabpanel" | "tabpanels" | "tablist" | "indicator")[];
};

export { tabsTheme };

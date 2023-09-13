import * as _chakra_ui_styled_system from '@chakra-ui/styled-system';

declare const tableTheme: {
    baseStyle?: {
        table: {
            fontVariantNumeric: string;
            borderCollapse: string;
            width: string;
        };
        th: {
            fontFamily: string;
            fontWeight: string;
            textTransform: string;
            letterSpacing: string;
            textAlign: string;
        };
        td: {
            textAlign: string;
        };
        caption: {
            mt: number;
            fontFamily: string;
            textAlign: string;
            fontWeight: string;
        };
    } | undefined;
    sizes?: {
        sm: {
            th: {
                px: string;
                py: string;
                lineHeight: string;
                fontSize: string;
            };
            td: {
                px: string;
                py: string;
                fontSize: string;
                lineHeight: string;
            };
            caption: {
                px: string;
                py: string;
                fontSize: string;
            };
        };
        md: {
            th: {
                px: string;
                py: string;
                lineHeight: string;
                fontSize: string;
            };
            td: {
                px: string;
                py: string;
                lineHeight: string;
            };
            caption: {
                px: string;
                py: string;
                fontSize: string;
            };
        };
        lg: {
            th: {
                px: string;
                py: string;
                lineHeight: string;
                fontSize: string;
            };
            td: {
                px: string;
                py: string;
                lineHeight: string;
            };
            caption: {
                px: string;
                py: string;
                fontSize: string;
            };
        };
    } | undefined;
    variants?: {
        simple: (props: _chakra_ui_styled_system.StyleFunctionProps) => {
            th: {
                "&[data-is-numeric=true]": {
                    textAlign: string;
                };
                color: string;
                borderBottom: string;
                borderColor: string;
            };
            td: {
                "&[data-is-numeric=true]": {
                    textAlign: string;
                };
                borderBottom: string;
                borderColor: string;
            };
            caption: {
                color: string;
            };
            tfoot: {
                tr: {
                    "&:last-of-type": {
                        th: {
                            borderBottomWidth: number;
                        };
                    };
                };
            };
        };
        striped: (props: _chakra_ui_styled_system.StyleFunctionProps) => {
            th: {
                "&[data-is-numeric=true]": {
                    textAlign: string;
                };
                color: string;
                borderBottom: string;
                borderColor: string;
            };
            td: {
                "&[data-is-numeric=true]": {
                    textAlign: string;
                };
                borderBottom: string;
                borderColor: string;
            };
            caption: {
                color: string;
            };
            tbody: {
                tr: {
                    "&:nth-of-type(odd)": {
                        "th, td": {
                            borderBottomWidth: string;
                            borderColor: string;
                        };
                        td: {
                            background: string;
                        };
                    };
                };
            };
            tfoot: {
                tr: {
                    "&:last-of-type": {
                        th: {
                            borderBottomWidth: number;
                        };
                    };
                };
            };
        };
        unstyled: {};
    } | undefined;
    defaultProps?: {
        size?: "md" | "sm" | "lg" | undefined;
        variant?: "unstyled" | "simple" | "striped" | undefined;
        colorScheme?: string | undefined;
    } | undefined;
    parts: ("table" | "caption" | "thead" | "tbody" | "tr" | "th" | "td" | "tfoot")[];
};

export { tableTheme };

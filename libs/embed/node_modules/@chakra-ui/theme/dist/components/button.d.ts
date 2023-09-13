import * as _chakra_ui_styled_system from '@chakra-ui/styled-system';

declare const buttonTheme: {
    baseStyle?: {
        lineHeight: string;
        borderRadius: string;
        fontWeight: string;
        transitionProperty: string;
        transitionDuration: string;
        _focusVisible: {
            boxShadow: string;
        };
        _disabled: {
            opacity: number;
            cursor: string;
            boxShadow: string;
        };
        _hover: {
            _disabled: {
                bg: string;
            };
        };
    } | undefined;
    sizes?: {
        lg: {
            h: string;
            minW: string;
            fontSize: string;
            px: string;
        };
        md: {
            h: string;
            minW: string;
            fontSize: string;
            px: string;
        };
        sm: {
            h: string;
            minW: string;
            fontSize: string;
            px: string;
        };
        xs: {
            h: string;
            minW: string;
            fontSize: string;
            px: string;
        };
    } | undefined;
    variants?: {
        ghost: (props: _chakra_ui_styled_system.StyleFunctionProps) => {
            color: string;
            _hover: {
                bg: string;
            };
            _active: {
                bg: string;
            };
            bg?: undefined;
        } | {
            color: string;
            bg: string;
            _hover: {
                bg: string;
            };
            _active: {
                bg: string;
            };
        };
        outline: (props: _chakra_ui_styled_system.StyleFunctionProps) => {
            color: string;
            _hover: {
                bg: string;
            };
            _active: {
                bg: string;
            };
            bg?: undefined;
            border: string;
            borderColor: string;
            ".chakra-button__group[data-attached][data-orientation=horizontal] > &:not(:last-of-type)": {
                marginEnd: string;
            };
            ".chakra-button__group[data-attached][data-orientation=vertical] > &:not(:last-of-type)": {
                marginBottom: string;
            };
        } | {
            color: string;
            bg: string;
            _hover: {
                bg: string;
            };
            _active: {
                bg: string;
            };
            border: string;
            borderColor: string;
            ".chakra-button__group[data-attached][data-orientation=horizontal] > &:not(:last-of-type)": {
                marginEnd: string;
            };
            ".chakra-button__group[data-attached][data-orientation=vertical] > &:not(:last-of-type)": {
                marginBottom: string;
            };
        };
        solid: (props: _chakra_ui_styled_system.StyleFunctionProps) => {
            bg: string;
            color: string;
            _hover: {
                bg: string;
                _disabled: {
                    bg: string;
                };
            };
            _active: {
                bg: string;
            };
        };
        link: (props: _chakra_ui_styled_system.StyleFunctionProps) => {
            padding: number;
            height: string;
            lineHeight: string;
            verticalAlign: string;
            color: string;
            _hover: {
                textDecoration: string;
                _disabled: {
                    textDecoration: string;
                };
            };
            _active: {
                color: string;
            };
        };
        unstyled: {
            bg: string;
            color: string;
            display: string;
            lineHeight: string;
            m: string;
            p: string;
        };
    } | undefined;
    defaultProps?: {
        size?: "md" | "xs" | "sm" | "lg" | undefined;
        variant?: "link" | "outline" | "solid" | "ghost" | "unstyled" | undefined;
        colorScheme?: string | undefined;
    } | undefined;
};

export { buttonTheme };

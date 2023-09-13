import * as _chakra_ui_styled_system from '@chakra-ui/styled-system';

declare const stepperTheme: {
    baseStyle?: (({ colorScheme: c }: _chakra_ui_styled_system.StyleFunctionProps) => {
        stepper: {
            [x: string]: string | {
                flexDirection: string;
                alignItems: string;
            } | {
                [x: string]: string;
                flexDirection?: undefined;
                alignItems?: undefined;
            };
            display: string;
            justifyContent: string;
            gap: string;
            "&[data-orientation=vertical]": {
                flexDirection: string;
                alignItems: string;
            };
            "&[data-orientation=horizontal]": {
                flexDirection: string;
                alignItems: string;
            };
            _dark: {
                [x: string]: string;
            };
        };
        title: {
            fontSize: string;
            fontWeight: string;
        };
        description: {
            fontSize: string;
            color: string;
        };
        number: {
            fontSize: string;
        };
        step: {
            flexShrink: number;
            position: string;
            display: string;
            gap: string;
            "&[data-orientation=horizontal]": {
                alignItems: string;
            };
            flex: string;
            "&:last-of-type:not([data-stretch])": {
                flex: string;
            };
        };
        icon: {
            flexShrink: number;
            width: string;
            height: string;
        };
        indicator: {
            flexShrink: number;
            borderRadius: string;
            width: string;
            height: string;
            display: string;
            justifyContent: string;
            alignItems: string;
            "&[data-status=active]": {
                borderWidth: string;
                borderColor: string;
            };
            "&[data-status=complete]": {
                bg: string;
                color: string;
            };
            "&[data-status=incomplete]": {
                borderWidth: string;
            };
        };
        separator: {
            bg: string;
            flex: string;
            "&[data-status=complete]": {
                bg: string;
            };
            "&[data-orientation=horizontal]": {
                width: string;
                height: string;
                marginStart: string;
            };
            "&[data-orientation=vertical]": {
                width: string;
                position: string;
                height: string;
                maxHeight: string;
                top: string;
                insetStart: string;
            };
        };
    }) | undefined;
    sizes?: {
        xs: {
            stepper: {
                [x: string]: string;
            };
        };
        sm: {
            stepper: {
                [x: string]: string;
            };
        };
        md: {
            stepper: {
                [x: string]: string;
            };
        };
        lg: {
            stepper: {
                [x: string]: string;
            };
        };
    } | undefined;
    variants?: {
        [key: string]: _chakra_ui_styled_system.PartsStyleInterpolation<{
            keys: ("number" | "icon" | "separator" | "title" | "description" | "stepper" | "indicator" | "step")[];
        }>;
    } | undefined;
    defaultProps?: {
        size?: "md" | "xs" | "sm" | "lg" | undefined;
        variant?: string | number | undefined;
        colorScheme?: string | undefined;
    } | undefined;
    parts: ("number" | "icon" | "separator" | "title" | "description" | "stepper" | "indicator" | "step")[];
};

export { stepperTheme };

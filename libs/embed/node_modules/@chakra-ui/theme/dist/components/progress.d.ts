import * as _chakra_ui_styled_system from '@chakra-ui/styled-system';

declare const progressTheme: {
    baseStyle?: ((props: _chakra_ui_styled_system.StyleFunctionProps) => {
        label: {
            lineHeight: string;
            fontSize: string;
            fontWeight: string;
            color: string;
        };
        filledTrack: any;
        track: {
            bg: string;
        };
    }) | undefined;
    sizes?: {
        xs: {
            track: {
                h: string;
            };
        };
        sm: {
            track: {
                h: string;
            };
        };
        md: {
            track: {
                h: string;
            };
        };
        lg: {
            track: {
                h: string;
            };
        };
    } | undefined;
    variants?: {
        [key: string]: _chakra_ui_styled_system.PartsStyleInterpolation<{
            keys: ("label" | "filledTrack" | "track")[];
        }>;
    } | undefined;
    defaultProps?: {
        size?: "md" | "xs" | "sm" | "lg" | undefined;
        variant?: string | number | undefined;
        colorScheme?: string | undefined;
    } | undefined;
    parts: ("label" | "filledTrack" | "track")[];
};

export { progressTheme };

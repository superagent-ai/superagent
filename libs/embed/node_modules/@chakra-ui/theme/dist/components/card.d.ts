declare const cardTheme: {
    baseStyle?: {
        container: {
            [x: string]: string;
            backgroundColor: string;
            boxShadow: string;
            borderRadius: string;
            color: string;
            borderWidth: string;
            borderColor: string;
        };
        body: {
            padding: string;
            flex: string;
        };
        header: {
            padding: string;
        };
        footer: {
            padding: string;
        };
    } | undefined;
    sizes?: {
        sm: {
            container: {
                [x: string]: string;
            };
        };
        md: {
            container: {
                [x: string]: string;
            };
        };
        lg: {
            container: {
                [x: string]: string;
            };
        };
    } | undefined;
    variants?: {
        elevated: {
            container: {
                [x: string]: string | {
                    [x: string]: string;
                };
                _dark: {
                    [x: string]: string;
                };
            };
        };
        outline: {
            container: {
                [x: string]: string;
            };
        };
        filled: {
            container: {
                [x: string]: string;
            };
        };
        unstyled: {
            body: {
                [x: string]: number;
            };
            header: {
                [x: string]: number;
            };
            footer: {
                [x: string]: number;
            };
        };
    } | undefined;
    defaultProps?: {
        size?: "md" | "sm" | "lg" | undefined;
        variant?: "outline" | "filled" | "unstyled" | "elevated" | undefined;
        colorScheme?: string | undefined;
    } | undefined;
    parts: ("container" | "header" | "body" | "footer")[];
};

export { cardTheme };

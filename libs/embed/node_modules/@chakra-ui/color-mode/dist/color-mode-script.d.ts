type ColorModeScriptProps = {
    type?: "localStorage" | "cookie";
    initialColorMode?: "light" | "dark" | "system";
    storageKey?: string;
    nonce?: string;
};
declare function getScriptSrc(props?: ColorModeScriptProps): string;
declare function ColorModeScript(props?: ColorModeScriptProps): JSX.Element;

export { ColorModeScript, ColorModeScriptProps, getScriptSrc };

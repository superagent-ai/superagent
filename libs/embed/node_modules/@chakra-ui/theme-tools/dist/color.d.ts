type Dict = {
    [key: string]: any;
};
/**
 * Get the color raw value from theme
 * @param theme - the theme object
 * @param color - the color path ("green.200")
 * @param fallback - the fallback color
 *
 * @deprecated This will be removed in the next major release.
 */
declare const getColor: (theme: Dict, color: string, fallback?: string) => any;
/**
 * Get the color css variable from theme
 */
declare const getColorVar: (theme: Dict, color: string, fallback?: string) => any;
/**
 * Determines if the tone of given color is "light" or "dark"
 * @param color - the color in hex, rgb, or hsl
 *
 * @deprecated This will be removed in the next major release.
 */
declare const tone: (color: string) => (theme: Dict) => "dark" | "light";
/**
 * Determines if a color tone is "dark"
 * @param color - the color in hex, rgb, or hsl
 *
 * @deprecated This will be removed in the next major release.
 */
declare const isDark: (color: string) => (theme: Dict) => boolean;
/**
 * Determines if a color tone is "light"
 * @param color - the color in hex, rgb, or hsl
 *
 * @deprecated This will be removed in the next major release.
 */
declare const isLight: (color: string) => (theme: Dict) => boolean;
/**
 * Make a color transparent
 * @param color - the color in hex, rgb, or hsl
 * @param opacity - the amount of opacity the color should have (0-1)
 *
 * @deprecated This will be removed in the next major release.
 */
declare const transparentize: (color: string, opacity: number) => (theme: Dict) => string;
/**
 * Add white to a color
 * @param color - the color in hex, rgb, or hsl
 * @param amount - the amount white to add (0-100)
 *
 * @deprecated This will be removed in the next major release.
 */
declare const whiten: (color: string, amount: number) => (theme: Dict) => string;
/**
 * Add black to a color
 * @param color - the color in hex, rgb, or hsl
 * @param amount - the amount black to add (0-100)
 *
 * @deprecated This will be removed in the next major release.
 */
declare const blacken: (color: string, amount: number) => (theme: Dict) => string;
/**
 * Darken a specified color
 * @param color - the color in hex, rgb, or hsl
 * @param amount - the amount to darken (0-100)
 *
 * @deprecated This will be removed in the next major release.
 */
declare const darken: (color: string, amount: number) => (theme: Dict) => string;
/**
 * Lighten a specified color
 * @param color - the color in hex, rgb, or hsl
 * @param amount - the amount to lighten (0-100)
 *
 * @deprecated This will be removed in the next major release.
 */
declare const lighten: (color: string, amount: number) => (theme: Dict) => void;
/**
 * Checks the contract ratio of between 2 colors,
 * based on the Web Content Accessibility Guidelines (Version 2.0).
 *
 * @param fg - the foreground or text color
 * @param bg - the background color
 *
 * @deprecated This will be removed in the next major release.
 */
declare const contrast: (fg: string, bg: string) => (theme: Dict) => number;
interface WCAG2Params {
    level?: "AA" | "AAA";
    size?: "large" | "small";
}
/**
 * Checks if a color meets the Web Content Accessibility
 * Guidelines (Version 2.0) for contrast ratio.
 *
 * @param textColor - the foreground or text color
 * @param bgColor - the background color
 * @param options
 *
 * @deprecated This will be removed in the next major release.
 */
declare const isAccessible: (textColor: string, bgColor: string, options?: WCAG2Params) => (theme: Dict) => boolean;
declare function isReadable(color1: string, color2: string, wcag2?: WCAG2Params): boolean;
declare function readability(color1: string, color2: string): number;
/**
 *
 * @deprecated This will be removed in the next major release.
 */
declare const complementary: (color: string) => (theme: Dict) => string;
declare function generateStripe(size?: string, color?: string): {
    backgroundImage: string;
    backgroundSize: string;
};
interface RandomColorOptions {
    /**
     * If passed, string will be used to generate
     * random color
     */
    string?: string;
    /**
     * List of colors to pick from at random
     */
    colors?: string[];
}
declare function randomColor(opts?: RandomColorOptions): string;

export { blacken, complementary, contrast, darken, generateStripe, getColor, getColorVar, isAccessible, isDark, isLight, isReadable, lighten, randomColor, readability, tone, transparentize, whiten };

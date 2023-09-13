import * as react from 'react';
import { ColorModeContextType } from './color-mode-types.js';

declare const ColorModeContext: react.Context<ColorModeContextType>;
/**
 * React hook that reads from `ColorModeProvider` context
 * Returns the color mode and function to toggle it
 */
declare function useColorMode(): ColorModeContextType;
/**
 * Change value based on color mode.
 *
 * @param light the light mode value
 * @param dark the dark mode value
 *
 * @example
 *
 * ```js
 * const Icon = useColorModeValue(MoonIcon, SunIcon)
 * ```
 */
declare function useColorModeValue<TLight = unknown, TDark = unknown>(light: TLight, dark: TDark): TLight | TDark;

export { ColorModeContext, useColorMode, useColorModeValue };

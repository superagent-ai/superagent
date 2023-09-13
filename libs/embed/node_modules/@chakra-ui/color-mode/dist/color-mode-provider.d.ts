import { ColorMode, ColorModeOptions } from './color-mode-types.js';
import { StorageManager } from './storage-manager.js';

interface ColorModeProviderProps {
    value?: ColorMode;
    children?: React.ReactNode;
    options?: ColorModeOptions;
    colorModeManager?: StorageManager;
}
/**
 * Provides context for the color mode based on config in `theme`
 * Returns the color mode and function to toggle the color mode
 */
declare function ColorModeProvider(props: ColorModeProviderProps): JSX.Element;
declare namespace ColorModeProvider {
    var displayName: string;
}
/**
 * Locks the color mode to `dark`, without any way to change it.
 */
declare function DarkMode(props: React.PropsWithChildren<{}>): JSX.Element;
declare namespace DarkMode {
    var displayName: string;
}
/**
 * Locks the color mode to `light` without any way to change it.
 */
declare function LightMode(props: React.PropsWithChildren<{}>): JSX.Element;
declare namespace LightMode {
    var displayName: string;
}

export { ColorModeProvider, ColorModeProviderProps, DarkMode, LightMode };

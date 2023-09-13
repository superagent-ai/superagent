interface UseShortcutProps {
    timeout?: number;
    preventDefault?: (event: React.KeyboardEvent) => boolean;
}
/**
 * React hook that provides an enhanced keydown handler,
 * that's used for key navigation within menus, select dropdowns.
 */
declare function useShortcut(props?: UseShortcutProps): (fn: (keysSoFar: string) => void) => (event: React.KeyboardEvent) => void;

export { UseShortcutProps, useShortcut };

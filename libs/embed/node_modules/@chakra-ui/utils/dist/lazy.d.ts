declare type LazyBehavior = "unmount" | "keepMounted";
interface DetermineLazyBehaviorOptions {
    hasBeenSelected?: boolean;
    isLazy?: boolean;
    isSelected?: boolean;
    lazyBehavior?: LazyBehavior;
}
/**
 * Determines whether the children of a disclosure widget
 * should be rendered or not, depending on the lazy behavior.
 *
 * Used in accordion, tabs, popover, menu and other disclosure
 * widgets.
 */
declare function determineLazyBehavior(options: DetermineLazyBehaviorOptions): boolean;

export { LazyBehavior, determineLazyBehavior };

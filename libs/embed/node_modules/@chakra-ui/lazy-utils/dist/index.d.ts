declare type LazyMode = "unmount" | "keepMounted";
interface LazyOptions {
    enabled?: boolean;
    isSelected?: boolean;
    wasSelected?: boolean;
    mode?: LazyMode;
}
/**
 * Determines whether the children of a disclosure widget
 * should be rendered or not, depending on the lazy behavior.
 *
 * Used in accordion, tabs, popover, menu and other disclosure
 * widgets.
 */
declare function lazyDisclosure(options: LazyOptions): boolean;

export { LazyMode, lazyDisclosure };

interface FocusableIn {
    node: HTMLElement;
    /**
     * tab index
     */
    index: number;
    /**
     * true, if this node belongs to a Lock
     */
    lockItem: boolean;
    /**
     * true, if this node is a focus-guard (system node)
     */
    guard: boolean;
}
/**
 * return list of focusable elements inside a given top node
 * @deprecated use {@link getFocusableIn}. Yep, there is typo in the function name
 */
export declare const getFocusabledIn: (topNode: HTMLElement) => FocusableIn[];
/**
 * return list of focusable elements inside a given top node
 */
export declare const getFocusableIn: (topNode: HTMLElement) => FocusableIn[];
export {};

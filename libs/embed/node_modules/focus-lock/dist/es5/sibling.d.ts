interface FocusNextOptions {
    /**
     * the component to "scope" focus in
     * @default document.body
     */
    scope?: HTMLElement | HTMLDocument;
    /**
     * enables cycling inside the scope
     * @default true
     */
    cycle?: boolean;
    /**
     * options for focus action to control it more precisely (ie. `{ preventScroll: true }`)
     */
    focusOptions?: FocusOptions;
}
/**
 * focuses next element in the tab-order
 * @param baseElement - common parent to scope active element search or tab cycle order
 * @param {FocusNextOptions} [options] - focus options
 */
export declare const focusNextElement: (baseElement: Element, options?: FocusNextOptions) => void;
/**
 * focuses prev element in the tab order
 * @param baseElement - common parent to scope active element search or tab cycle order
 * @param {FocusNextOptions} [options] - focus options
 */
export declare const focusPrevElement: (baseElement: Element, options?: FocusNextOptions) => void;
export {};

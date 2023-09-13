/**
 * given top node(s) and the last active element return the element to be focused next
 * @param topNode
 * @param lastNode
 */
export declare const getFocusMerge: (topNode: Element | Element[], lastNode: Element | null) => undefined | {
    node: HTMLElement;
};

type DescendantOptions<T = {}> = T & {
    /**
     * If `true`, the item will be registered in all nodes map
     * but omitted from enabled nodes map
     */
    disabled?: boolean;
    /**
     * The id of the item
     */
    id?: string;
};
type Descendant<T, K> = DescendantOptions<K> & {
    /**
     * DOM element of the item
     */
    node: T;
    /**
     * index of item in all nodes map and enabled nodes map
     */
    index: number;
};
/**
 * @internal
 *
 * Class to manage descendants and their relative indices in the DOM.
 * It uses `node.compareDocumentPosition(...)` under the hood
 */
declare class DescendantsManager<T extends HTMLElement, K extends Record<string, any> = {}> {
    private descendants;
    register: (nodeOrOptions: T | null | DescendantOptions<K>) => void | ((node: T | null) => void);
    unregister: (node: T) => void;
    destroy: () => void;
    private assignIndex;
    count: () => number;
    enabledCount: () => number;
    values: () => Descendant<T, K>[];
    enabledValues: () => Descendant<T, K>[];
    item: (index: number) => Descendant<T, K> | undefined;
    enabledItem: (index: number) => Descendant<T, K> | undefined;
    first: () => Descendant<T, K> | undefined;
    firstEnabled: () => Descendant<T, K> | undefined;
    last: () => Descendant<T, K> | undefined;
    lastEnabled: () => Descendant<T, K> | undefined;
    indexOf: (node: T | null) => number;
    enabledIndexOf: (node: T | null) => number;
    next: (index: number, loop?: boolean) => Descendant<T, K> | undefined;
    nextEnabled: (index: number, loop?: boolean) => Descendant<T, K> | undefined;
    prev: (index: number, loop?: boolean) => Descendant<T, K> | undefined;
    prevEnabled: (index: number, loop?: boolean) => Descendant<T, K> | undefined;
    private registerNode;
}

export { Descendant, DescendantOptions, DescendantsManager };

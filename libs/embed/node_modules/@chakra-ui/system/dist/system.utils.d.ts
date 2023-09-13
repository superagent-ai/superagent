/**
 * All html and svg elements for chakra components.
 * This is mostly for `chakra.<element>` syntax.
 */
type DOMElements = keyof JSX.IntrinsicElements;
declare function isTag(target: any): boolean;
declare function getDisplayName(primitive: any): string;

export { DOMElements, isTag as default, getDisplayName };

declare function useId(idProp?: string, prefix?: string): string;
/**
 * React hook to generate ids for use in compound components
 *
 * @param idProp the external id passed from the user
 * @param prefixes array of prefixes to use
 *
 * @example
 *
 * ```js
 * const [buttonId, menuId] = useIds("52", "button", "menu")
 *
 * // buttonId will be `button-52`
 * // menuId will be `menu-52`
 * ```
 */
declare function useIds(idProp?: string, ...prefixes: string[]): string[];
/**
 * Used to generate an id, and after render, check if that id is rendered, so we know
 * if we can use it in places such as `aria-labelledby`.
 *
 * @param partId - The unique id for the component part
 *
 * @example
 * const { ref, id } = useOptionalPart<HTMLInputElement>(`${id}-label`)
 */
declare function useOptionalPart<T = any>(partId: string): {
    ref: (node: T) => void;
    id: string | null;
    isRendered: boolean;
};

export { useId, useIds, useOptionalPart };

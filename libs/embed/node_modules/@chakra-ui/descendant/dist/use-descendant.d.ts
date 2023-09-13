import * as react from 'react';
import { DescendantsManager, DescendantOptions } from './descendant.js';

/**
 * @internal
 * React hook that initializes the DescendantsManager
 */
declare function useDescendants<T extends HTMLElement = HTMLElement, K extends Record<string, any> = {}>(): DescendantsManager<T, K>;
interface UseDescendantsReturn extends ReturnType<typeof useDescendants> {
}
declare function createDescendantContext<T extends HTMLElement = HTMLElement, K extends Record<string, any> = {}>(): readonly [react.Provider<DescendantsManager<T, K>>, () => DescendantsManager<T, K>, () => DescendantsManager<T, K>, (options?: DescendantOptions<K>) => {
    descendants: UseDescendantsReturn;
    index: number;
    enabledIndex: number;
    register: (node: T | null) => void;
}];

export { UseDescendantsReturn, createDescendantContext };

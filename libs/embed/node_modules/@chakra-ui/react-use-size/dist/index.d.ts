import { ElementSize } from '@zag-js/element-size';

declare function useSizes<T extends HTMLElement | null>({ getNodes, observeMutation, }: {
    getNodes: () => T[];
    observeMutation?: boolean;
}): (ElementSize | undefined)[];
declare function useSize<T extends HTMLElement | null>(subject: T | React.RefObject<T>): ElementSize | undefined;

export { useSize, useSizes };

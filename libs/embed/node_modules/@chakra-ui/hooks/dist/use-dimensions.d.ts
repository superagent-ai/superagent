import { BoxModel } from '@chakra-ui/utils';

/**
 * React hook to measure a component's dimensions
 *
 * @param ref ref of the component to measure
 * @param observe if `true`, resize and scroll observers will be turned on
 *
 * @deprecated use the `useSize` hook instead
 *
 * ```jsx
 * import { useSize } from "@chakra-ui/react-use-size"
 * ```
 */
declare function useDimensions(ref: React.RefObject<HTMLElement>, observe?: boolean): BoxModel | null;

export { useDimensions };

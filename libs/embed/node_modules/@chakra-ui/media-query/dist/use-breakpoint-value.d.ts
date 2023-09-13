import { UseBreakpointOptions } from './use-breakpoint.js';

/**
 * React hook for getting the value for the current breakpoint from the
 * provided responsive values object.
 *
 * For SSR, you can use a package like [is-mobile](https://github.com/kaimallea/isMobile)
 * to get the default breakpoint value from the user-agent
 *
 * @example
 * const width = useBreakpointValue({ base: '150px', md: '250px' })
 *
 * @see Docs https://chakra-ui.com/docs/hooks/use-breakpoint-value
 */
declare function useBreakpointValue<T = any>(values: Partial<Record<string, T>> | Array<T | null>, arg?: UseBreakpointOptions | string): T | undefined;

export { useBreakpointValue };

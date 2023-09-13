import { UseMediaQueryOptions } from './use-media-query.js';

/**
 * React hook used to get the user's animation preference.
 *
 * @see Docs https://chakra-ui.com/docs/hooks/use-prefers-reduced-motion
 */
declare function usePrefersReducedMotion(options?: UseMediaQueryOptions): boolean;
/**
 * React hook for getting the user's color mode preference.
 */
declare function useColorModePreference(options?: UseMediaQueryOptions): "dark" | "light" | undefined;

export { useColorModePreference, usePrefersReducedMotion };

type UseMediaQueryOptions = {
    fallback?: boolean | boolean[];
    ssr?: boolean;
};
/**
 * React hook that tracks state of a CSS media query
 *
 * @param query the media query to match
 * @param options the media query options { fallback, ssr }
 *
 * @see Docs https://chakra-ui.com/docs/hooks/use-media-query
 */
declare function useMediaQuery(query: string | string[], options?: UseMediaQueryOptions): boolean[];

export { UseMediaQueryOptions, useMediaQuery };

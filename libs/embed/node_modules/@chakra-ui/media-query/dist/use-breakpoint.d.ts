type UseBreakpointOptions = {
    ssr?: boolean;
    fallback?: string;
};
/**
 * React hook used to get the current responsive media breakpoint.
 *
 * For SSR, you can use a package like [is-mobile](https://github.com/kaimallea/isMobile)
 * to get the default breakpoint value from the user-agent.
 */
declare function useBreakpoint(arg?: string | UseBreakpointOptions): string;

export { UseBreakpointOptions, useBreakpoint };

interface CreateContextOptions {
    /**
     * If `true`, React will throw if context is `null` or `undefined`
     * In some cases, you might want to support nested context, so you can set it to `false`
     */
    strict?: boolean;
    /**
     * Error message to throw if the context is `undefined`
     */
    errorMessage?: string;
    /**
     * The display name of the context
     */
    name?: string;
}
declare type CreateContextReturn<T> = [
    React.Provider<T>,
    () => T,
    React.Context<T>
];
/**
 * Creates a named context, provider, and hook.
 *
 * @param options create context options
 */
declare function createContext<ContextType>(options?: CreateContextOptions): CreateContextReturn<ContextType>;

export { CreateContextOptions, CreateContextReturn, createContext };

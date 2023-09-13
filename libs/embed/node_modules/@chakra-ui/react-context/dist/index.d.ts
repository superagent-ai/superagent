interface CreateContextOptions<T> {
    strict?: boolean;
    hookName?: string;
    providerName?: string;
    errorMessage?: string;
    name?: string;
    defaultValue?: T;
}
type CreateContextReturn<T> = [
    React.Provider<T>,
    () => T,
    React.Context<T>
];
declare function createContext<T>(options?: CreateContextOptions<T>): CreateContextReturn<T>;

export { CreateContextOptions, CreateContextReturn, createContext };

interface Environment {
    getWindow: () => Window;
    getDocument: () => Document;
}
declare function useEnvironment({ defer }?: {
    defer?: boolean;
}): Environment;
interface EnvironmentProviderProps {
    children: React.ReactNode;
    disabled?: boolean;
    environment?: Environment;
}
declare function EnvironmentProvider(props: EnvironmentProviderProps): JSX.Element;
declare namespace EnvironmentProvider {
    var displayName: string;
}

export { EnvironmentProvider, EnvironmentProviderProps, useEnvironment };

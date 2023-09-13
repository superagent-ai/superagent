import { ChakraProviderProps as ChakraProviderProps$1 } from '@chakra-ui/provider';
import { ToastProviderProps } from '@chakra-ui/toast';

interface ChakraProviderProps extends ChakraProviderProps$1 {
    /**
     * Provide defaults for `useToast()` usages for `ChakraProvider`s children
     */
    toastOptions?: ToastProviderProps;
}
declare const ChakraProvider: ({ children, theme, toastOptions, ...restProps }: ChakraProviderProps) => JSX.Element;
declare const ChakraBaseProvider: ({ children, theme, toastOptions, ...restProps }: ChakraProviderProps) => JSX.Element;

export { ChakraBaseProvider, ChakraProvider, ChakraProviderProps };

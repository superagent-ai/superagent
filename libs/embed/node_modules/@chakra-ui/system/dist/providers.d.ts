import * as react from 'react';
import { CreateContextReturn } from '@chakra-ui/react-utils';
import { SystemStyleObject } from '@chakra-ui/styled-system';
import { ThemeProviderProps as ThemeProviderProps$1 } from '@emotion/react';

interface ThemeProviderProps extends ThemeProviderProps$1 {
    cssVarsRoot?: string;
}
declare function ThemeProvider(props: ThemeProviderProps): JSX.Element;
interface CSSVarsProps {
    /**
     * The element to attach the CSS custom properties to.
     * @default ":host, :root"
     */
    root?: string;
}
declare function CSSVars({ root }: CSSVarsProps): JSX.Element;
/**
 * @deprecated - Prefer to use `createStylesContext` to provide better error messages
 *
 * @example
 *
 * ```jsx
 * import { createStylesContext } from "@chakra-ui/react"
 *
 * const [StylesProvider, useStyles] = createStylesContext("Component")
 * ```
 */
declare const StylesProvider: react.Provider<Record<string, SystemStyleObject>>;
declare const useStyles: () => Record<string, SystemStyleObject>;

/**
 * Helper function that creates context with a standardized errorMessage related to the component
 * @param componentName
 * @returns [StylesProvider, useStyles]
 */
declare function createStylesContext(componentName: string): CreateStyleContextReturn;
type CreateStyleContextReturn = CreateContextReturn<Record<string, SystemStyleObject>>;
/**
 * Applies styles defined in `theme.styles.global` globally
 * using emotion's `Global` component
 */
declare function GlobalStyle(): JSX.Element;

export { CSSVars, CSSVarsProps, CreateStyleContextReturn, GlobalStyle, StylesProvider, ThemeProvider, ThemeProviderProps, createStylesContext, useStyles };

import * as _chakra_ui_system from '@chakra-ui/system';
import { HTMLChakraProps, ThemingProps } from '@chakra-ui/system';

interface SpinnerOptions {
    /**
     * The color of the empty area in the spinner
     * @default "transparent"
     */
    emptyColor?: string;
    /**
     * The color of the spinner
     */
    color?: string;
    /**
     * The thickness of the spinner
     * @default "2px"
     * @example
     * ```jsx
     * <Spinner thickness="4px"/>
     * ```
     */
    thickness?: string;
    /**
     * The speed of the spinner.
     * @default "0.45s"
     * @example
     * ```jsx
     * <Spinner speed="0.2s"/>
     * ```
     */
    speed?: string;
    /**
     * For accessibility, it is important to add a fallback loading text.
     * This text will be visible to screen readers.
     * @default "Loading..."
     */
    label?: string;
}
interface SpinnerProps extends Omit<HTMLChakraProps<"div">, keyof SpinnerOptions>, SpinnerOptions, ThemingProps<"Spinner"> {
}
/**
 * Spinner is used to indicate the loading state of a page or a component,
 * It renders a `div` by default.
 *
 * @see Docs https://chakra-ui.com/spinner
 */
declare const Spinner: _chakra_ui_system.ComponentWithAs<"div", SpinnerProps>;

export { Spinner, SpinnerProps };

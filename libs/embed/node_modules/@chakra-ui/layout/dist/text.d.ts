import * as _chakra_ui_system from '@chakra-ui/system';
import { HTMLChakraProps, ThemingProps, SystemProps } from '@chakra-ui/system';

interface TextProps extends HTMLChakraProps<"p">, ThemingProps<"Text"> {
    /**
     * The CSS `text-align` property
     * @type SystemProps["textAlign"]
     */
    align?: SystemProps["textAlign"];
    /**
     * The CSS `text-decoration` property
     * @type SystemProps["textDecoration"]
     */
    decoration?: SystemProps["textDecoration"];
    /**
     * The CSS `text-transform` property
     * @type SystemProps["textTransform"]
     */
    casing?: SystemProps["textTransform"];
}
/**
 * Used to render texts or paragraphs.
 *
 * @see Docs https://chakra-ui.com/text
 */
declare const Text: _chakra_ui_system.ComponentWithAs<"p", TextProps>;

export { Text, TextProps };

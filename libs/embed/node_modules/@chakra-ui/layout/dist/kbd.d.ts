import * as _chakra_ui_system from '@chakra-ui/system';
import { HTMLChakraProps, ThemingProps } from '@chakra-ui/system';

interface KbdProps extends HTMLChakraProps<"kbd">, ThemingProps<"Kbd"> {
}
/**
 * Semantic component to render a keyboard shortcut
 * within an application.
 *
 * @example
 *
 * ```jsx
 * <Kbd>⌘ + T</Kbd>
 * ```
 *
 * @see Docs https://chakra-ui.com/kbd
 */
declare const Kbd: _chakra_ui_system.ComponentWithAs<"kbd", KbdProps>;

export { Kbd, KbdProps };

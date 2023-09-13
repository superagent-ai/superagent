import * as _chakra_ui_system from '@chakra-ui/system';
import { HTMLChakraProps, ThemingProps, SystemProps } from '@chakra-ui/system';
import { UseCheckboxProps } from '@chakra-ui/checkbox';

interface SwitchProps extends Omit<UseCheckboxProps, "isIndeterminate">, Omit<HTMLChakraProps<"label">, keyof UseCheckboxProps>, ThemingProps<"Switch"> {
    /**
     * The spacing between the switch and its label text
     * @default 0.5rem
     * @type SystemProps["marginLeft"]
     */
    spacing?: SystemProps["marginLeft"];
}
/**
 * The `Switch` component is used as an alternative for the checkbox component for switching between "enabled" and "disabled" states.
 *
 * @see Docs https://chakra-ui.com/docs/components/switch
 * @see WAI-ARIA https://www.w3.org/WAI/ARIA/apg/patterns/switch/
 */
declare const Switch: _chakra_ui_system.ComponentWithAs<"input", SwitchProps>;

export { Switch, SwitchProps };

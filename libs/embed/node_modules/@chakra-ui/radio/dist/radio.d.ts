import * as _chakra_ui_system from '@chakra-ui/system';
import { ThemingProps, SystemProps, HTMLChakraProps } from '@chakra-ui/system';
import { UseRadioProps } from './use-radio.js';
import '@chakra-ui/react-types';

type Omitted = "onChange" | "defaultChecked" | "checked";
interface BaseControlProps extends Omit<HTMLChakraProps<"div">, Omitted> {
}
interface RadioProps extends UseRadioProps, ThemingProps<"Radio">, BaseControlProps {
    /**
     * The spacing between the checkbox and its label text
     * @default 0.5rem
     * @type SystemProps["marginLeft"]
     */
    spacing?: SystemProps["marginLeft"];
    /**
     * Additional props to be forwarded to the `input` element
     */
    inputProps?: React.InputHTMLAttributes<HTMLInputElement>;
}
/**
 * Radio component is used in forms when a user needs to select a single value from
 * several options.
 *
 * @see Docs https://chakra-ui.com/radio
 */
declare const Radio: _chakra_ui_system.ComponentWithAs<"input", RadioProps>;

export { Radio, RadioProps };

import * as _chakra_ui_system from '@chakra-ui/system';
import { ThemingProps, HTMLChakraProps } from '@chakra-ui/system';
import { UseRadioGroupReturn, UseRadioGroupProps } from './use-radio-group.js';
import 'react';
import '@chakra-ui/react-types';

interface RadioGroupContext extends Pick<UseRadioGroupReturn, "onChange" | "value" | "name" | "isDisabled" | "isFocusable">, Omit<ThemingProps<"Radio">, "orientation"> {
}
declare const useRadioGroupContext: () => RadioGroupContext;

type Omitted = "onChange" | "value" | "defaultValue" | "defaultChecked" | "children";
interface RadioGroupProps extends UseRadioGroupProps, Omit<HTMLChakraProps<"div">, Omitted>, Omit<ThemingProps<"Radio">, "orientation"> {
    children: React.ReactNode;
}
/**
 * Used for multiple radios which are bound in one group,
 * and it indicates which option is selected.
 *
 * @see Docs https://chakra-ui.com/radio
 */
declare const RadioGroup: _chakra_ui_system.ComponentWithAs<"div", RadioGroupProps>;

export { RadioGroup, RadioGroupContext, RadioGroupProps, useRadioGroupContext };

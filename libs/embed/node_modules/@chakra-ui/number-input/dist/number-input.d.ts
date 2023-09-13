import * as _chakra_ui_system from '@chakra-ui/system';
import { SystemStyleObject, ThemingProps, HTMLChakraProps } from '@chakra-ui/system';
import { UseNumberInputProps } from './use-number-input.js';
import '@chakra-ui/counter';
import '@chakra-ui/react-types';

declare const useNumberInputStyles: () => Record<string, SystemStyleObject>;

interface InputOptions {
    /**
     * The border color when the input is focused. Use color keys in `theme.colors`
     * @example
     * focusBorderColor = "blue.500"
     */
    focusBorderColor?: string;
    /**
     * The border color when the input is invalid. Use color keys in `theme.colors`
     * @example
     * errorBorderColor = "red.500"
     */
    errorBorderColor?: string;
}
interface NumberInputProps extends UseNumberInputProps, ThemingProps<"NumberInput">, InputOptions, Omit<HTMLChakraProps<"div">, keyof UseNumberInputProps> {
}
/**
 * NumberInput
 *
 * React component that provides context and logic to all
 * number input sub-components.
 *
 * It renders a `div` by default.
 *
 * @see Docs http://chakra-ui.com/numberinput
 */
declare const NumberInput: _chakra_ui_system.ComponentWithAs<"div", NumberInputProps>;
interface NumberInputStepperProps extends HTMLChakraProps<"div"> {
}
/**
 * NumberInputStepper
 *
 * React component used to group the increment and decrement
 * button spinners.
 *
 * It renders a `div` by default.
 *
 * @see Docs http://chakra-ui.com/components/number-input
 */
declare const NumberInputStepper: _chakra_ui_system.ComponentWithAs<"div", NumberInputStepperProps>;
interface NumberInputFieldProps extends HTMLChakraProps<"input"> {
}
/**
 * NumberInputField
 *
 * React component that represents the actual `input` field
 * where users can type to edit numeric values.
 *
 * It renders an `input` by default and ensures only numeric
 * values can be typed.
 *
 * @see Docs http://chakra-ui.com/numberinput
 */
declare const NumberInputField: _chakra_ui_system.ComponentWithAs<"input", NumberInputFieldProps>;
declare const StyledStepper: _chakra_ui_system.ChakraComponent<"div", {}>;
interface NumberDecrementStepperProps extends HTMLChakraProps<"div"> {
}
/**
 * NumberDecrementStepper
 *
 * React component used to decrement the number input's value
 *
 * It renders a `div` with `role=button` by default
 */
declare const NumberDecrementStepper: _chakra_ui_system.ComponentWithAs<"div", NumberDecrementStepperProps>;
interface NumberIncrementStepperProps extends HTMLChakraProps<"div"> {
}
/**
 * NumberIncrementStepper
 *
 * React component used to increment the number input's value
 *
 * It renders a `div` with `role=button` by default
 */
declare const NumberIncrementStepper: _chakra_ui_system.ComponentWithAs<"div", NumberIncrementStepperProps>;

export { NumberDecrementStepper, NumberDecrementStepperProps, NumberIncrementStepper, NumberIncrementStepperProps, NumberInput, NumberInputField, NumberInputFieldProps, NumberInputProps, NumberInputStepper, NumberInputStepperProps, StyledStepper, useNumberInputStyles };

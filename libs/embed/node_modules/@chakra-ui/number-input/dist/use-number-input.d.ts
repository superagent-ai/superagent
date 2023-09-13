import { UseCounterProps } from '@chakra-ui/counter';
import { PropGetter, InputDOMAttributes } from '@chakra-ui/react-types';

interface UseNumberInputProps extends UseCounterProps {
    /**
     * If `true`, the input will be focused as you increment
     * or decrement the value with the stepper
     *
     * @default true
     */
    focusInputOnChange?: boolean;
    /**
     * This controls the value update when you blur out of the input.
     * - If `true` and the value is greater than `max`, the value will be reset to `max`
     * - Else, the value remains the same.
     *
     * @default true
     */
    clampValueOnBlur?: boolean;
    /**
     * This is used to format the value so that screen readers
     * can speak out a more human-friendly value.
     *
     * It is used to set the `aria-valuetext` property of the input
     */
    getAriaValueText?(value: string | number): string;
    /**
     * If `true`, the input will be in readonly mode
     */
    isReadOnly?: boolean;
    /**
     * If `true`, the input will have `aria-invalid` set to `true`
     */
    isInvalid?: boolean;
    /**
     * Whether the input should be disabled
     */
    isDisabled?: boolean;
    /**
     * Whether the input is required
     */
    isRequired?: boolean;
    /**
     * The `id` to use for the number input field.
     */
    id?: string;
    /**
     * The pattern used to check the <input> element's value against on form submission.
     *
     * @default
     * "[0-9]*(.[0-9]+)?"
     */
    pattern?: React.InputHTMLAttributes<any>["pattern"];
    /**
     * Hints at the type of data that might be entered by the user. It also determines
     * the type of keyboard shown to the user on mobile devices
     *
     * @default
     * "decimal"
     */
    inputMode?: React.InputHTMLAttributes<any>["inputMode"];
    /**
     * If `true`, the input's value will change based on mouse wheel
     */
    allowMouseWheel?: boolean;
    /**
     * The HTML `name` attribute used for forms
     */
    name?: string;
    "aria-describedby"?: string;
    "aria-label"?: string;
    "aria-labelledby"?: string;
    onFocus?: React.FocusEventHandler<HTMLInputElement>;
    onBlur?: React.FocusEventHandler<HTMLInputElement>;
    onInvalid?: (message: ValidityState, value: string, valueAsNumber: number) => void;
    /**
     * Whether the pressed key should be allowed in the input.
     * The default behavior is to allow DOM floating point characters defined by /^[Ee0-9+\-.]$/
     */
    isValidCharacter?: (value: string) => boolean;
    /**
     * If using a custom display format, this converts the custom format to a format `parseFloat` understands.
     */
    parse?: (value: string) => string;
    /**
     * If using a custom display format, this converts the default format to the custom format.
     */
    format?: (value: string | number) => string | number;
}
type ValidityState = "rangeUnderflow" | "rangeOverflow";
/**
 * React hook that implements the WAI-ARIA Spin Button widget
 * and used to create numeric input fields.
 *
 * It returns prop getters you can use to build your own
 * custom number inputs.
 *
 * @see WAI-ARIA https://www.w3.org/WAI/ARIA/apg/patterns/spinbutton/
 * @see Docs     https://www.chakra-ui.com/useNumberInput
 * @see WHATWG   https://html.spec.whatwg.org/multipage/input.html#number-state-(type=number)
 */
declare function useNumberInput(props?: UseNumberInputProps): {
    value: string;
    valueAsNumber: number;
    isFocused: boolean;
    isDisabled: boolean | undefined;
    isReadOnly: boolean | undefined;
    getIncrementButtonProps: PropGetter;
    getDecrementButtonProps: PropGetter;
    getInputProps: PropGetter<InputDOMAttributes, InputDOMAttributes>;
    htmlProps: {
        defaultValue?: string | number | undefined;
        value?: string | number | undefined;
    };
};
type UseNumberInputReturn = ReturnType<typeof useNumberInput>;

export { UseNumberInputProps, UseNumberInputReturn, useNumberInput };

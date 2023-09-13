import { PropGetter, InputDOMAttributes } from '@chakra-ui/react-types';

/**
 * @todo use the `useClickable` hook here
 * to manage the isFocusable & isDisabled props
 */
interface UseRadioProps {
    /**
     * id assigned to input
     */
    id?: string;
    /**
     * The name of the input field in a radio
     * (Useful for form submission).
     */
    name?: string;
    /**
     * The value to be used in the radio button.
     * This is the value that will be returned on form submission.
     */
    value?: string;
    /**
     * If `true`, the radio will be checked.
     * You'll need to pass `onChange` to update its value (since it is now controlled)
     *
     * @default false
     */
    isChecked?: boolean;
    /**
     * If `true`, the radio will be initially checked.
     *
     * @default false
     */
    defaultChecked?: boolean;
    /**
     * If `true`, the radio will be disabled
     *
     * @default false
     */
    isDisabled?: boolean;
    /**
     * If `true` and `isDisabled` is true, the radio will remain
     * focusable but not interactive.
     *
     * @default false
     */
    isFocusable?: boolean;
    /**
     * If `true`, the radio will be read-only
     *
     * @default false
     */
    isReadOnly?: boolean;
    /**
     * If `true`, the radio button will be invalid. This also sets `aria-invalid` to `true`.
     *
     * @default false
     */
    isInvalid?: boolean;
    /**
     * If `true`, the radio button will be required. This also sets `aria-required` to `true`.
     *
     * @default false
     */
    isRequired?: boolean;
    /**
     * Function called when checked state of the `input` changes
     */
    onChange?: (event: React.ChangeEvent<HTMLInputElement>) => void;
    /**
     * @internal
     */
    "data-radiogroup"?: any;
    /**
     * Refers to the `id` of the element that labels the radio element.
     */
    "aria-describedby"?: string;
}
interface RadioState {
    isInvalid: boolean | undefined;
    isFocused: boolean;
    isChecked: boolean;
    isActive: boolean;
    isHovered: boolean;
    isDisabled: boolean | undefined;
    isReadOnly: boolean | undefined;
    isRequired: boolean | undefined;
}
/**
 * `useRadio` is a custom hook used to provide radio functionality, as well as state and focus management to custom radio components when using it.
 *
 * @see Docs https://chakra-ui.com/docs/hooks/use-radio
 */
declare function useRadio(props?: UseRadioProps): {
    state: RadioState;
    /**
     * @deprecated - use `getRadioProps` instead
     */
    getCheckboxProps: PropGetter;
    getRadioProps: PropGetter;
    getInputProps: PropGetter<InputDOMAttributes, InputDOMAttributes>;
    getLabelProps: PropGetter;
    getRootProps: PropGetter;
    htmlProps: {};
};
type UseRadioReturn = ReturnType<typeof useRadio>;

export { RadioState, UseRadioProps, UseRadioReturn, useRadio };

import * as react from 'react';
import * as _chakra_ui_descendant from '@chakra-ui/descendant';

declare const PinInputDescendantsProvider: react.Provider<_chakra_ui_descendant.DescendantsManager<HTMLInputElement, {}>>;
declare const usePinInputDescendantsContext: () => _chakra_ui_descendant.DescendantsManager<HTMLInputElement, {}>;
declare const usePinInputDescendants: () => _chakra_ui_descendant.DescendantsManager<HTMLInputElement, {}>;
declare const usePinInputDescendant: (options?: {
    disabled?: boolean | undefined;
    id?: string | undefined;
} | undefined) => {
    descendants: _chakra_ui_descendant.UseDescendantsReturn;
    index: number;
    enabledIndex: number;
    register: (node: HTMLInputElement | null) => void; /**
     * If `true`, the pin input component signals to its fields that they should
     * use `autocomplete="one-time-code"`.
     */
};
type PinInputContext = Omit<UsePinInputReturn, "descendants"> & {
    /**
     * Sets the pin input component to the disabled state
     */
    isDisabled?: boolean;
    /**
     * Sets the pin input component to the invalid state
     */
    isInvalid?: boolean;
};
declare const PinInputProvider: react.Provider<PinInputContext>;
declare const usePinInputContext: () => PinInputContext;
interface UsePinInputProps {
    /**
     * If `true`, the pin input receives focus on mount
     */
    autoFocus?: boolean;
    /**
     * The value of the pin input. This is the value
     * that will be returned when the pin input is filled
     */
    value?: string;
    /**
     * The default value of the pin input
     */
    defaultValue?: string;
    /**
     * Function called on input change
     */
    onChange?: (value: string) => void;
    /**
     * Function called when all inputs have valid values
     */
    onComplete?: (value: string) => void;
    /**
     * The placeholder for the pin input
     */
    placeholder?: string;
    /**
     * If `true`, focus will move automatically to the next input once filled
     * @default true
     */
    manageFocus?: boolean;
    /**
     * If `true`, the pin input component signals to its fields that they should
     * use `autocomplete="one-time-code"`.
     */
    otp?: boolean;
    /**
     * The top-level id string that will be applied to the input fields.
     * The index of the input will be appended to this top-level id.
     *
     * @example
     * if id="foo", the first input will have `foo-0`
     */
    id?: string;
    /**
     * If `true`, the pin input component is put in the disabled state
     */
    isDisabled?: boolean;
    /**
     * If `true`, the pin input component is put in the invalid state
     */
    isInvalid?: boolean;
    /**
     * The type of values the pin-input should allow
     */
    type?: "alphanumeric" | "number";
    /**
     * If `true`, the input's value will be masked just like `type=password`
     */
    mask?: boolean;
}
/**
 * @internal
 */
declare function usePinInput(props?: UsePinInputProps): {
    getInputProps: (props: InputProps & {
        index: number;
    }) => InputProps;
    id: string;
    descendants: _chakra_ui_descendant.DescendantsManager<HTMLInputElement, {}>;
    values: string[];
    setValue: (value: string, index: number, handleFocus?: boolean) => void;
    setValues: react.Dispatch<react.SetStateAction<string[]>>;
    clear: () => void;
};
type UsePinInputReturn = ReturnType<typeof usePinInput>;
interface UsePinInputFieldProps extends InputProps {
    ref?: React.Ref<HTMLInputElement>;
}
/**
 * @internal
 */
declare function usePinInputField(props?: UsePinInputFieldProps, ref?: React.Ref<any>): InputProps;
interface InputProps extends Omit<React.ComponentPropsWithRef<"input">, "color" | "height" | "width"> {
}

export { PinInputContext, PinInputDescendantsProvider, PinInputProvider, UsePinInputFieldProps, UsePinInputProps, UsePinInputReturn, usePinInput, usePinInputContext, usePinInputDescendant, usePinInputDescendants, usePinInputDescendantsContext, usePinInputField };

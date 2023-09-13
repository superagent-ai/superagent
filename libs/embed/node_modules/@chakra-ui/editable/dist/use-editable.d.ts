import { PropGetter } from '@chakra-ui/react-types';
import { RefObject } from 'react';

interface FocusableElement {
    focus(options?: FocusOptions): void;
}
interface UseEditableProps {
    /**
     * The value of the Editable in both edit & preview mode
     */
    value?: string;
    /**
     * The initial value of the Editable in both edit & preview mode
     */
    defaultValue?: string;
    /**
     * If `true`, the Editable will be disabled.
     */
    isDisabled?: boolean;
    /**
     * If `true`, the Editable will start with edit mode by default.
     */
    startWithEditView?: boolean;
    /**
     * If `true`, the read only view, has a `tabIndex` set to `0`
     * so it can receive focus via the keyboard or click.
     * @default true
     */
    isPreviewFocusable?: boolean;
    /**
     * If `true`, it'll update the value onBlur and turn off the edit mode.
     * @default true
     */
    submitOnBlur?: boolean;
    /**
     * Callback invoked when user changes input.
     */
    onChange?: (nextValue: string) => void;
    /**
     * Callback invoked when user cancels input with the `Esc` key.
     * It provides the last confirmed value as argument.
     */
    onCancel?: (previousValue: string) => void;
    /**
     * Callback invoked when user confirms value with `enter` key or by blurring input.
     */
    onSubmit?: (nextValue: string) => void;
    /**
     * Callback invoked once the user enters edit mode.
     */
    onEdit?: () => void;
    /**
     * Callback invoked when the user either submits or cancels.
     * It provides the last confirmed value as argument.
     */
    onBlur?: (nextValue: string) => void;
    /**
     * If `true`, the input's text will be highlighted on focus.
     * @default true
     */
    selectAllOnFocus?: boolean;
    /**
     * The placeholder text when the value is empty.
     */
    placeholder?: string;
    /**
     * The `ref` of element to receive focus when the modal closes.
     */
    finalFocusRef?: RefObject<FocusableElement>;
}
/**
 * React hook for managing the inline renaming of some text.
 *
 * @see Docs https://chakra-ui.com/editable
 */
declare function useEditable(props?: UseEditableProps): {
    isEditing: boolean;
    isDisabled: boolean | undefined;
    isValueEmpty: boolean;
    value: string;
    onEdit: () => void;
    onCancel: () => void;
    onSubmit: () => void;
    getPreviewProps: PropGetter;
    getInputProps: PropGetter;
    getTextareaProps: PropGetter;
    getEditButtonProps: PropGetter;
    getSubmitButtonProps: PropGetter;
    getCancelButtonProps: PropGetter;
    htmlProps: {};
};
type UseEditableReturn = ReturnType<typeof useEditable>;

export { UseEditableProps, UseEditableReturn, useEditable };

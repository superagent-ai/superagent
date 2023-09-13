import * as _chakra_ui_system from '@chakra-ui/system';
import { SystemStyleObject, HTMLChakraProps, ThemingProps } from '@chakra-ui/system';
import * as react from 'react';
import { PropGetter } from '@chakra-ui/react-types';

declare const useFormControlStyles: () => Record<string, SystemStyleObject>;

interface FormControlOptions {
    /**
     * If `true`, the form control will be required. This has 2 side effects:
     * - The `FormLabel` will show a required indicator
     * - The form element (e.g, Input) will have `aria-required` set to `true`
     *
     * @default false
     */
    isRequired?: boolean;
    /**
     * If `true`, the form control will be disabled. This has 2 side effects:
     * - The `FormLabel` will have `data-disabled` attribute
     * - The form element (e.g, Input) will be disabled
     *
     * @default false
     */
    isDisabled?: boolean;
    /**
     * If `true`, the form control will be invalid. This has 2 side effects:
     * - The `FormLabel` and `FormErrorIcon` will have `data-invalid` set to `true`
     * - The form element (e.g, Input) will have `aria-invalid` set to `true`
     *
     * @default false
     */
    isInvalid?: boolean;
    /**
     * If `true`, the form control will be readonly
     *
     * @default false
     */
    isReadOnly?: boolean;
}
interface FormControlContext extends FormControlOptions {
    /**
     * The label text used to inform users as to what information is
     * requested for a text field.
     */
    label?: string;
    /**
     * The custom `id` to use for the form control. This is passed directly to the form element (e.g, Input).
     * - The form element (e.g. Input) gets the `id`
     * - The form label id: `form-label-${id}`
     * - The form error text id: `form-error-text-${id}`
     * - The form helper text id: `form-helper-text-${id}`
     */
    id?: string;
}
type FormControlProviderContext = Omit<ReturnType<typeof useFormControlProvider>, "getRootProps" | "htmlProps">;
declare const useFormControlContext: () => FormControlProviderContext;
declare function useFormControlProvider(props: FormControlContext): {
    isRequired: boolean;
    isInvalid: boolean;
    isReadOnly: boolean;
    isDisabled: boolean;
    isFocused: boolean;
    onFocus: () => void;
    onBlur: () => void;
    hasFeedbackText: boolean;
    setHasFeedbackText: react.Dispatch<react.SetStateAction<boolean>>;
    hasHelpText: boolean;
    setHasHelpText: react.Dispatch<react.SetStateAction<boolean>>;
    id: string;
    labelId: string;
    feedbackId: string;
    helpTextId: string;
    htmlProps: {
        /**
         * The label text used to inform users as to what information is
         * requested for a text field.
         */
        label?: string | undefined;
    };
    getHelpTextProps: PropGetter;
    getErrorMessageProps: PropGetter;
    getRootProps: PropGetter;
    getLabelProps: PropGetter;
    getRequiredIndicatorProps: PropGetter;
};
interface FormControlProps extends HTMLChakraProps<"div">, ThemingProps<"FormControl">, FormControlContext {
}
/**
 * FormControl provides context such as
 * `isInvalid`, `isDisabled`, and `isRequired` to form elements.
 *
 * This is commonly used in form elements such as `input`,
 * `select`, `textarea`, etc.
 *
 * @see Docs https://chakra-ui.com/docs/components/form-control
 */
declare const FormControl: _chakra_ui_system.ComponentWithAs<"div", FormControlProps>;
interface FormHelperTextProps extends HTMLChakraProps<"div"> {
}
/**
 * FormHelperText
 *
 * Assistive component that conveys additional guidance
 * about the field, such as how it will be used and what
 * types in values should be provided.
 */
declare const FormHelperText: _chakra_ui_system.ComponentWithAs<"div", FormHelperTextProps>;

export { FormControl, FormControlOptions, FormControlProps, FormHelperText, FormHelperTextProps, useFormControlContext, useFormControlStyles };

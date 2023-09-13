import * as react from 'react';
import { FormControlOptions } from './form-control.js';
import '@chakra-ui/system';
import '@chakra-ui/react-types';

interface UseFormControlProps<T extends HTMLElement> extends FormControlOptions {
    id?: string;
    onFocus?: React.FocusEventHandler<T>;
    onBlur?: React.FocusEventHandler<T>;
    disabled?: boolean;
    readOnly?: boolean;
    required?: boolean;
    "aria-describedby"?: string;
}
/**
 * React hook that provides the props that should be spread on to
 * input fields (`input`, `select`, `textarea`, etc.).
 *
 * It provides a convenient way to control a form fields, validation
 * and helper text.
 *
 * @internal
 */
declare function useFormControl<T extends HTMLElement>(props: UseFormControlProps<T>): {
    disabled: boolean;
    readOnly: boolean;
    required: boolean;
    "aria-invalid": boolean | undefined;
    "aria-required": boolean | undefined;
    "aria-readonly": boolean | undefined;
    "aria-describedby": string | undefined;
    id: string;
    onFocus: (event: react.FocusEvent<T, Element>) => void;
    onBlur: (event: react.FocusEvent<T, Element>) => void;
};
/**
 * @internal
 */
declare function useFormControlProps<T extends HTMLElement>(props: UseFormControlProps<T>): {
    "aria-describedby": string | undefined;
    id: string;
    isDisabled: boolean;
    isReadOnly: boolean;
    isRequired: boolean;
    isInvalid: boolean;
    onFocus: (event: react.FocusEvent<T, Element>) => void;
    onBlur: (event: react.FocusEvent<T, Element>) => void;
};

export { UseFormControlProps, useFormControl, useFormControlProps };

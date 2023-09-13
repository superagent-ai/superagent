import * as _chakra_ui_system from '@chakra-ui/system';
import { SystemStyleObject, HTMLChakraProps, ThemingProps } from '@chakra-ui/system';
import { IconProps } from '@chakra-ui/icon';

declare const useFormErrorStyles: () => Record<string, SystemStyleObject>;

interface FormErrorMessageProps extends HTMLChakraProps<"div">, ThemingProps<"FormErrorMessage"> {
}
/**
 * Used to provide feedback about an invalid input,
 * and suggest clear instructions on how to fix it.
 */
declare const FormErrorMessage: _chakra_ui_system.ComponentWithAs<"div", FormErrorMessageProps>;
/**
 * Used as the visual indicator that a field is invalid or
 * a field has incorrect values.
 */
declare const FormErrorIcon: _chakra_ui_system.ComponentWithAs<"svg", IconProps>;

export { FormErrorIcon, FormErrorMessage, FormErrorMessageProps, useFormErrorStyles };

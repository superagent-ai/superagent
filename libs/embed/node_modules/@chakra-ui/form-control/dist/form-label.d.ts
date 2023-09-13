import * as _chakra_ui_system from '@chakra-ui/system';
import { HTMLChakraProps, ThemingProps } from '@chakra-ui/system';

interface FormLabelProps extends HTMLChakraProps<"label">, ThemingProps<"FormLabel"> {
    /**
     * @type React.ReactElement
     */
    requiredIndicator?: React.ReactElement;
    /**
     * @type React.ReactNode
     */
    optionalIndicator?: React.ReactNode;
}
/**
 * Used to enhance the usability of form controls.
 *
 * It is used to inform users as to what information
 * is requested for a form field.
 *
 * ♿️ Accessibility: Every form field should have a form label.
 */
declare const FormLabel: _chakra_ui_system.ComponentWithAs<"label", FormLabelProps>;
interface RequiredIndicatorProps extends HTMLChakraProps<"span"> {
}
/**
 * Used to show a "required" text or an asterisks (*) to indicate that
 * a field is required.
 */
declare const RequiredIndicator: _chakra_ui_system.ComponentWithAs<"span", RequiredIndicatorProps>;

export { FormLabel, FormLabelProps, RequiredIndicator, RequiredIndicatorProps };

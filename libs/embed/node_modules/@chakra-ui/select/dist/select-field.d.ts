import * as _chakra_ui_system from '@chakra-ui/system';
import { HTMLChakraProps } from '@chakra-ui/system';

type Omitted = "disabled" | "required" | "readOnly" | "size";
interface SelectFieldProps extends Omit<HTMLChakraProps<"select">, Omitted> {
    /**
     * @default false
     */
    isDisabled?: boolean;
}
declare const SelectField: _chakra_ui_system.ComponentWithAs<"select", SelectFieldProps>;

export { SelectField, SelectFieldProps };

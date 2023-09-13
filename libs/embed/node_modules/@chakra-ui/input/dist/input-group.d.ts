import * as _chakra_ui_system from '@chakra-ui/system';
import { SystemStyleObject, HTMLChakraProps, ThemingProps } from '@chakra-ui/system';

declare const useInputGroupStyles: () => Record<string, SystemStyleObject>;

interface InputGroupProps extends HTMLChakraProps<"div">, ThemingProps<"Input"> {
}
declare const InputGroup: _chakra_ui_system.ComponentWithAs<"div", InputGroupProps>;

export { InputGroup, InputGroupProps, useInputGroupStyles };

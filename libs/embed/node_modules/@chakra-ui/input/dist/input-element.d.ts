import * as _chakra_ui_system from '@chakra-ui/system';
import { HTMLChakraProps } from '@chakra-ui/system';

interface InputElementProps extends HTMLChakraProps<"div"> {
    placement?: "left" | "right";
}
type InputLeftElementProps = Omit<InputElementProps, "placement">;
declare const InputLeftElement: _chakra_ui_system.ComponentWithAs<"div", InputLeftElementProps>;
type InputRightElementProps = Omit<InputElementProps, "placement">;
declare const InputRightElement: _chakra_ui_system.ComponentWithAs<"div", InputRightElementProps>;

export { InputElementProps, InputLeftElement, InputLeftElementProps, InputRightElement, InputRightElementProps };

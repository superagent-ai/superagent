import * as _chakra_ui_system from '@chakra-ui/system';
import { HTMLChakraProps } from '@chakra-ui/system';

interface TableCaptionProps extends HTMLChakraProps<"caption"> {
    /**
     * The placement of the table caption. This sets the `caption-side` CSS attribute.
     * @default "bottom"
     */
    placement?: "top" | "bottom";
}
declare const TableCaption: _chakra_ui_system.ComponentWithAs<"caption", TableCaptionProps>;

export { TableCaption, TableCaptionProps };

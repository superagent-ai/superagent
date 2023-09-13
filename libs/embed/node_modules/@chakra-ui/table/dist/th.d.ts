import * as _chakra_ui_system from '@chakra-ui/system';
import { HTMLChakraProps } from '@chakra-ui/system';

interface TableColumnHeaderProps extends HTMLChakraProps<"th"> {
    /**
     * Aligns the cell content to the right
     * @default false
     */
    isNumeric?: boolean;
}
declare const Th: _chakra_ui_system.ComponentWithAs<"th", TableColumnHeaderProps>;

export { TableColumnHeaderProps, Th };

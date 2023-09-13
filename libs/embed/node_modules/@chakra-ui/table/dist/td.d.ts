import * as _chakra_ui_system from '@chakra-ui/system';
import { HTMLChakraProps } from '@chakra-ui/system';

interface TableCellProps extends HTMLChakraProps<"td"> {
    /**
     * Aligns the cell content to the right
     * @default false
     */
    isNumeric?: boolean;
}
declare const Td: _chakra_ui_system.ComponentWithAs<"td", TableCellProps>;

export { TableCellProps, Td };

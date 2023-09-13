import * as _chakra_ui_system from '@chakra-ui/system';
import { SystemStyleObject, HTMLChakraProps, ThemingProps } from '@chakra-ui/system';

declare const useTableStyles: () => Record<string, SystemStyleObject>;

interface TableOptions {
    layout?: SystemStyleObject["tableLayout"];
}
interface TableProps extends HTMLChakraProps<"table">, TableOptions, ThemingProps<"Table"> {
}
/**
 * The `Table` component is used to organize and display data efficiently. It renders a `<table>` element by default.
 *
 * @see Docs https://chakra-ui.com/docs/components/table
 * @see WAI-ARIA https://www.w3.org/WAI/ARIA/apg/patterns/table/
 */
declare const Table: _chakra_ui_system.ComponentWithAs<"table", TableProps>;

export { Table, TableOptions, TableProps, useTableStyles };

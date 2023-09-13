import * as _chakra_ui_system from '@chakra-ui/system';
import { SystemStyleObject, HTMLChakraProps, ThemingProps } from '@chakra-ui/system';

declare const useStatStyles: () => Record<string, SystemStyleObject>;

interface StatProps extends HTMLChakraProps<"div">, ThemingProps<"Stat"> {
}
/**
 * The `Stat` component is used to display some statistics.
 *
 * @see Docs https://chakra-ui.com/docs/components/stat
 */
declare const Stat: _chakra_ui_system.ComponentWithAs<"div", StatProps>;

export { Stat, StatProps, useStatStyles };

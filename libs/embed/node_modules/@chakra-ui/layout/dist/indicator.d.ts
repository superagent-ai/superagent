import * as _chakra_ui_system from '@chakra-ui/system';
import { SystemStyleObject, ResponsiveValue, HTMLChakraProps } from '@chakra-ui/system';

interface IndicatorOptions {
    /**
     * The x offset of the indicator
     */
    offsetX?: SystemStyleObject["left"];
    /**
     * The y offset of the indicator
     */
    offsetY?: SystemStyleObject["top"];
    /**
     * The x and y offset of the indicator
     */
    offset?: SystemStyleObject["top"];
    /**
     * The placement of the indicator
     * @default "top-end"
     */
    placement?: ResponsiveValue<"bottom-end" | "bottom-start" | "top-end" | "top-start" | "bottom-center" | "top-center" | "middle-center" | "middle-end" | "middle-start">;
}
interface IndicatorProps extends Omit<HTMLChakraProps<"div">, keyof IndicatorOptions>, IndicatorOptions {
}
declare const Indicator: _chakra_ui_system.ComponentWithAs<"div", IndicatorProps>;

export { Indicator, IndicatorOptions, IndicatorProps };

import * as _chakra_ui_system from '@chakra-ui/system';
import { SystemProps, HTMLChakraProps } from '@chakra-ui/system';

interface GridOptions {
    /**
     * Shorthand prop for `gridTemplateColumns`
     * @type SystemProps["gridTemplateColumns"]
     */
    templateColumns?: SystemProps["gridTemplateColumns"];
    /**
     * Shorthand prop for `gridGap`
     * @type SystemProps["gridGap"]
     */
    gap?: SystemProps["gridGap"];
    /**
     * Shorthand prop for `gridRowGap`
     * @type SystemProps["gridRowGap"]
     */
    rowGap?: SystemProps["gridRowGap"];
    /**
     * Shorthand prop for `gridColumnGap`
     * @type SystemProps["gridColumnGap"]
     */
    columnGap?: SystemProps["gridColumnGap"];
    /**
     * Shorthand prop for `gridAutoFlow`
     * @type SystemProps["gridAutoFlow"]
     */
    autoFlow?: SystemProps["gridAutoFlow"];
    /**
     * Shorthand prop for `gridAutoRows`
     * @type SystemProps["gridAutoRows"]
     */
    autoRows?: SystemProps["gridAutoRows"];
    /**
     * Shorthand prop for `gridAutoColumns`
     * @type SystemProps["gridAutoColumns"]
     */
    autoColumns?: SystemProps["gridAutoColumns"];
    /**
     * Shorthand prop for `gridTemplateRows`
     * @type SystemProps["gridTemplateRows"]
     */
    templateRows?: SystemProps["gridTemplateRows"];
    /**
     * Shorthand prop for `gridTemplateAreas`
     * @type SystemProps["gridTemplateAreas"]
     */
    templateAreas?: SystemProps["gridTemplateAreas"];
    /**
     * Shorthand prop for `gridColumn`
     * @type SystemProps["gridColumn"]
     */
    column?: SystemProps["gridColumn"];
    /**
     * Shorthand prop for `gridRow`
     * @type SystemProps["gridRow"]
     */
    row?: SystemProps["gridRow"];
}
interface GridProps extends Omit<HTMLChakraProps<"div">, keyof GridOptions>, GridOptions {
}
/**
 * React component used to create grid layouts.
 *
 * It renders a `div` with `display: grid` and
 * comes with helpful style shorthand.
 *
 * @see Docs https://chakra-ui.com/grid
 */
declare const Grid: _chakra_ui_system.ComponentWithAs<"div", GridProps>;

export { Grid, GridOptions, GridProps };

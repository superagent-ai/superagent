import * as _chakra_ui_system from '@chakra-ui/system';
import { HTMLChakraProps, ResponsiveValue } from '@chakra-ui/system';

interface AspectRatioOptions {
    /**
     * The aspect ratio of the Box. Common values are:
     *
     * `21/9`, `16/9`, `9/16`, `4/3`, `1.85/1`
     */
    ratio?: ResponsiveValue<number>;
}
interface AspectRatioProps extends Omit<HTMLChakraProps<"div">, "aspectRatio">, AspectRatioOptions {
}
/**
 * React component used to cropping media (videos, images and maps)
 * to a desired aspect ratio.
 *
 * @see Docs https://chakra-ui.com/aspectratiobox
 */
declare const AspectRatio: _chakra_ui_system.ComponentWithAs<"div", AspectRatioProps>;

export { AspectRatio, AspectRatioProps };

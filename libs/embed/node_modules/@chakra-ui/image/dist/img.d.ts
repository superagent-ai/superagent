import * as _chakra_ui_system from '@chakra-ui/system';
import { HTMLChakraProps } from '@chakra-ui/system';
import { NativeImageOptions } from './native-image.js';

interface ImgProps extends HTMLChakraProps<"img">, NativeImageOptions {
}
/**
 * Fallback component for most SSR users who want to use the native `img` with
 * support for chakra props
 */
declare const Img: _chakra_ui_system.ComponentWithAs<"img", ImgProps>;

export { Img, ImgProps };

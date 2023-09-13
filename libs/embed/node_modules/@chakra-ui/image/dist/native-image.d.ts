import * as _chakra_ui_system from '@chakra-ui/system';
import { PropsOf } from '@chakra-ui/system';

interface NativeImageOptions {
    /**
     * The native HTML `width` attribute to the passed to the `img`
     */
    htmlWidth?: string | number;
    /**
     * The native HTML `height` attribute to the passed to the `img`
     */
    htmlHeight?: string | number;
}
interface NativeImageProps extends PropsOf<"img">, NativeImageOptions {
}
declare const NativeImage: _chakra_ui_system.ComponentWithAs<_chakra_ui_system.As, NativeImageProps>;

export { NativeImage, NativeImageOptions };

import * as _chakra_ui_system from '@chakra-ui/system';
import { HTMLChakraProps } from '@chakra-ui/system';

interface LinkOverlayProps extends HTMLChakraProps<"a"> {
    /**
     *  If `true`, the link will open in new tab
     *
     * @default false
     */
    isExternal?: boolean;
}
declare const LinkOverlay: _chakra_ui_system.ComponentWithAs<"a", LinkOverlayProps>;
interface LinkBoxProps extends HTMLChakraProps<"div"> {
}
/**
 * `LinkBox` is used to wrap content areas within a link while ensuring semantic html
 *
 * @see Docs https://chakra-ui.com/docs/navigation/link-overlay
 * @see Resources https://www.sarasoueidan.com/blog/nested-links
 */
declare const LinkBox: _chakra_ui_system.ComponentWithAs<"div", LinkBoxProps>;

export { LinkBox, LinkBoxProps, LinkOverlay, LinkOverlayProps };

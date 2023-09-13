import { MaybeRenderProp } from '@chakra-ui/react-types';
import { ThemingProps } from '@chakra-ui/system';
import { UsePopoverProps } from './use-popover.js';
import '@chakra-ui/popper';
import '@chakra-ui/lazy-utils';

interface PopoverProps extends UsePopoverProps, ThemingProps<"Popover"> {
    /**
     * The content of the popover. It is usually the `PopoverTrigger`,
     * and `PopoverContent`
     */
    children?: MaybeRenderProp<{
        isOpen: boolean;
        onClose: () => void;
        forceUpdate: (() => void) | undefined;
    }>;
}
/**
 * Popover is used to bring attention to specific user interface elements,
 * typically to suggest an action or to guide users through a new experience.
 *
 * @see Docs https://chakra-ui.com/docs/components/popover
 */
declare function Popover(props: PopoverProps): JSX.Element;
declare namespace Popover {
    var displayName: string;
}

export { Popover, PopoverProps };

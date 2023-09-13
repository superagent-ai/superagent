import * as _chakra_ui_system from '@chakra-ui/system';
import { HTMLChakraProps, ThemingProps } from '@chakra-ui/system';
import { PortalProps } from '@chakra-ui/portal';
import { HTMLMotionProps } from 'framer-motion';
import { UseTooltipProps } from './use-tooltip.js';
import '@chakra-ui/popper';
import '@chakra-ui/react-types';

interface TooltipProps extends HTMLChakraProps<"div">, ThemingProps<"Tooltip">, UseTooltipProps {
    /**
     * The React component to use as the
     * trigger for the tooltip
     */
    children: React.ReactNode;
    /**
     * The label of the tooltip
     */
    label?: React.ReactNode;
    /**
     * The accessible, human friendly label to use for
     * screen readers.
     *
     * If passed, tooltip will show the content `label`
     * but expose only `aria-label` to assistive technologies
     */
    "aria-label"?: string;
    /**
     * If `true`, the tooltip will wrap its children
     * in a `<span/>` with `tabIndex=0`
     * @default false
     */
    shouldWrapChildren?: boolean;
    /**
     * If `true`, the tooltip will show an arrow tip
     * @default false
     */
    hasArrow?: boolean;
    /**
     * Props to be forwarded to the portal component
     */
    portalProps?: Pick<PortalProps, "appendToParentPortal" | "containerRef">;
    motionProps?: HTMLMotionProps<"div">;
}
/**
 * Tooltips display informative text when users hover, focus on, or tap an element.
 *
 * @see Docs     https://chakra-ui.com/docs/overlay/tooltip
 * @see WAI-ARIA https://www.w3.org/WAI/ARIA/apg/patterns/tooltip/
 */
declare const Tooltip: _chakra_ui_system.ComponentWithAs<"div", TooltipProps>;

export { Tooltip, TooltipProps };

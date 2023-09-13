import { PropGetter } from '@chakra-ui/react-types';
import { Modifier, VirtualElement } from '@popperjs/core';
import { PlacementWithLogical } from './popper.placement.js';

interface UsePopperProps {
    /**
     * Whether the popper.js should be enabled
     */
    enabled?: boolean;
    /**
     * The main and cross-axis offset to displace popper element
     * from its reference element.
     */
    offset?: [number, number];
    /**
     * The distance or margin between the reference and popper.
     * It is used internally to create an `offset` modifier.
     *
     * NB: If you define `offset` prop, it'll override the gutter.
     * @default 8
     */
    gutter?: number;
    /**
     * If `true`, will prevent the popper from being cut off and ensure
     * it's visible within the boundary area.
     * @default true
     */
    preventOverflow?: boolean;
    /**
     * If `true`, the popper will change its placement and flip when it's
     * about to overflow its boundary area.
     * @default true
     */
    flip?: boolean;
    /**
     * If `true`, the popper will match the width of the reference at all times.
     * It's useful for `autocomplete`, `date-picker` and `select` patterns.
     * @default false
     */
    matchWidth?: boolean;
    /**
     * The boundary area for the popper. Used within the `preventOverflow` modifier
     * @default "clippingParents"
     */
    boundary?: "clippingParents" | "scrollParent" | HTMLElement;
    /**
     * If provided, determines whether the popper will reposition itself on `scroll`
     * and `resize` of the window.
     * @default true
     */
    eventListeners?: boolean | {
        scroll?: boolean;
        resize?: boolean;
    };
    /**
     * The padding required to prevent the arrow from
     * reaching the very edge of the popper.
     * @default 8
     */
    arrowPadding?: number;
    /**
     * The CSS positioning strategy to use.
     * @default "absolute"
     */
    strategy?: "absolute" | "fixed";
    /**
     * The placement of the popper relative to its reference.
     * @default "bottom"
     */
    placement?: PlacementWithLogical;
    /**
     * Array of popper.js modifiers. Check the docs to see
     * the list of possible modifiers you can pass.
     *
     * @see Docs https://popper.js.org/docs/v2/modifiers/
     */
    modifiers?: Array<Partial<Modifier<string, any>>>;
    /**
     * Theme direction `ltr` or `rtl`. Popper's placement will
     * be set accordingly
     * @default "ltr"
     */
    direction?: "ltr" | "rtl";
}
type ArrowCSSVarProps = {
    /**
     * The size of the popover arrow.
     * This sets the `--popper-arrow-size` css property
     */
    size?: string | number;
    /**
     * The box-shadow color of the popover arrow.
     * This sets the `--popper-arrow-shadow-color` css property
     */
    shadowColor?: string;
    /**
     * The background color of the popper arrow.
     * This sets the `--popper-arrow-bg` css property.
     */
    bg?: string;
};
declare function usePopper(props?: UsePopperProps): {
    update(): void;
    forceUpdate(): void;
    transformOrigin: string;
    referenceRef: <T extends Element | VirtualElement>(node: T | null) => void;
    popperRef: <T_1 extends HTMLElement>(node: T_1 | null) => void;
    getPopperProps: PropGetter;
    getArrowProps: PropGetter;
    getArrowInnerProps: PropGetter;
    getReferenceProps: PropGetter;
};
type UsePopperReturn = ReturnType<typeof usePopper>;

export { ArrowCSSVarProps, UsePopperProps, UsePopperReturn, usePopper };

import * as react from 'react';
import { HTMLMotionProps } from 'framer-motion';
import { WithTransitionConfig } from './transition-utils.js';

interface SlideFadeOptions {
    /**
     * The offset on the horizontal or `x` axis
     * @default 0
     */
    offsetX?: string | number;
    /**
     * The offset on the vertical or `y` axis
     * @default 8
     */
    offsetY?: string | number;
    /**
     * If `true`, the element will be transitioned back to the offset when it leaves.
     * Otherwise, it'll only fade out
     * @default true
     */
    reverse?: boolean;
}
declare const slideFadeConfig: HTMLMotionProps<"div">;
interface SlideFadeProps extends SlideFadeOptions, WithTransitionConfig<HTMLMotionProps<"div">> {
}
declare const SlideFade: react.ForwardRefExoticComponent<SlideFadeProps & react.RefAttributes<HTMLDivElement>>;

export { SlideFade, SlideFadeProps, slideFadeConfig };

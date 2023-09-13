import * as react from 'react';
import { HTMLMotionProps } from 'framer-motion';
import { WithTransitionConfig } from './transition-utils.js';

interface ScaleFadeOptions {
    /**
     * The initial scale of the element
     * @default 0.95
     */
    initialScale?: number;
    /**
     * If `true`, the element will transition back to exit state
     * @default true
     */
    reverse?: boolean;
}
declare const scaleFadeConfig: HTMLMotionProps<"div">;
interface ScaleFadeProps extends ScaleFadeOptions, WithTransitionConfig<HTMLMotionProps<"div">> {
}
declare const ScaleFade: react.ForwardRefExoticComponent<ScaleFadeProps & react.RefAttributes<HTMLDivElement>>;

export { ScaleFade, ScaleFadeProps, scaleFadeConfig };

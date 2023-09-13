import * as react from 'react';
import { HTMLMotionProps } from 'framer-motion';
import { SlideDirection, WithTransitionConfig } from './transition-utils.js';
export { SlideDirection } from './transition-utils.js';

interface SlideOptions {
    /**
     * The direction to slide from
     * @default "right"
     */
    direction?: SlideDirection;
}
interface SlideProps extends WithTransitionConfig<HTMLMotionProps<"div">>, SlideOptions {
    motionProps?: HTMLMotionProps<"div">;
}
declare const Slide: react.ForwardRefExoticComponent<SlideProps & react.RefAttributes<HTMLDivElement>>;

export { Slide, SlideOptions, SlideProps };

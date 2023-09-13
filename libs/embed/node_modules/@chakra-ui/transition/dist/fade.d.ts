import * as react from 'react';
import { HTMLMotionProps } from 'framer-motion';
import { WithTransitionConfig } from './transition-utils.js';

interface FadeProps extends WithTransitionConfig<HTMLMotionProps<"div">> {
}
declare const fadeConfig: HTMLMotionProps<"div">;
declare const Fade: react.ForwardRefExoticComponent<FadeProps & react.RefAttributes<HTMLDivElement>>;

export { Fade, FadeProps, fadeConfig };

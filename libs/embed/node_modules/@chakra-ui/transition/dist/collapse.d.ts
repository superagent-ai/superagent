import * as react from 'react';
import { HTMLMotionProps } from 'framer-motion';
import { WithTransitionConfig } from './transition-utils.js';

interface CollapseOptions {
    /**
     * If `true`, the opacity of the content will be animated
     * @default true
     */
    animateOpacity?: boolean;
    /**
     * The height you want the content in its collapsed state.
     * @default 0
     */
    startingHeight?: number | string;
    /**
     * The height you want the content in its expanded state.
     * @default "auto"
     */
    endingHeight?: number | string;
}
type ICollapse = CollapseProps;
interface CollapseProps extends WithTransitionConfig<HTMLMotionProps<"div">>, CollapseOptions {
}
declare const Collapse: react.ForwardRefExoticComponent<CollapseProps & react.RefAttributes<HTMLDivElement>>;

export { Collapse, CollapseOptions, CollapseProps, ICollapse };

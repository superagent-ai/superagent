import * as _chakra_ui_system from '@chakra-ui/system';
import { HTMLChakraProps, ThemingProps } from '@chakra-ui/system';

interface SkeletonOptions {
    /**
     * The color at the animation start
     */
    startColor?: string;
    /**
     * The color at the animation end
     */
    endColor?: string;
    /**
     * If `true`, it'll render its children with a nice fade transition
     *
     * @default false
     */
    isLoaded?: boolean;
    /**
     * The animation speed in seconds
     *
     * @default 0.8
     */
    speed?: number;
    /**
     * The fadeIn duration in seconds. Requires `isLoaded` toggled to `true` in order to see the transition.
     *
     * @default 0.4
     */
    fadeDuration?: number;
    /**
     * If `true`, the skeleton will take the width of it's children
     * @default false
     */
    fitContent?: boolean;
}
type ISkeleton = SkeletonOptions;
interface SkeletonProps extends HTMLChakraProps<"div">, SkeletonOptions, ThemingProps<"Skeleton"> {
}
/**
 * `Skeleton` is used to display the loading state of some component.
 *
 * @see Docs https://chakra-ui.com/docs/components/skeleton
 */
declare const Skeleton: _chakra_ui_system.ComponentWithAs<"div", SkeletonProps>;

export { ISkeleton, Skeleton, SkeletonOptions, SkeletonProps };

import { SkeletonProps } from './skeleton.js';
import '@chakra-ui/system';

interface SkeletonTextProps extends SkeletonProps {
    spacing?: SkeletonProps["margin"];
    skeletonHeight?: SkeletonProps["height"];
    startColor?: SkeletonProps["startColor"];
    endColor?: SkeletonProps["endColor"];
    isLoaded?: SkeletonProps["isLoaded"];
}
/**
 * `SkeletonText` is used to display the loading state in the form of text.
 *
 * @see Docs https://chakra-ui.com/docs/components/skeleton
 */
declare const SkeletonText: React.FC<SkeletonTextProps>;

export { SkeletonText, SkeletonTextProps };

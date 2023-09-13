import * as _chakra_ui_system from '@chakra-ui/system';
import { SystemStyleObject, HTMLChakraProps, ThemingProps } from '@chakra-ui/system';
import { GetProgressPropsOptions } from './progress.utils.js';
import 'react';

declare const useProgressStyles: () => Record<string, SystemStyleObject>;

interface ProgressFilledTrackProps extends HTMLChakraProps<"div">, GetProgressPropsOptions {
}
interface ProgressTrackProps extends HTMLChakraProps<"div"> {
}
interface ProgressOptions {
    /**
     * The `value` of the progress indicator.
     * If `undefined` the progress bar will be in `indeterminate` state
     */
    value?: number;
    /**
     * The minimum value of the progress
     * @default 0
     */
    min?: number;
    /**
     * The maximum value of the progress
     * @default 100
     */
    max?: number;
    /**
     * If `true`, the progress bar will show stripe
     *
     * @default false
     */
    hasStripe?: boolean;
    /**
     * If `true`, and hasStripe is `true`, the stripes will be animated
     *
     * @default false
     */
    isAnimated?: boolean;
    /**
     * If `true`, the progress will be indeterminate and the `value`
     * prop will be ignored
     *
     * @default false
     */
    isIndeterminate?: boolean;
}
interface ProgressProps extends ProgressOptions, ThemingProps<"Progress">, HTMLChakraProps<"div"> {
}
/**
 * Progress (Linear)
 *
 * Progress is used to display the progress status for a task that takes a long
 * time or consists of several steps.
 *
 * It includes accessible attributes to help assistive technologies understand
 * and speak the progress values.
 *
 * @see Docs https://chakra-ui.com/progress
 */
declare const Progress: _chakra_ui_system.ComponentWithAs<"div", ProgressProps>;

export { Progress, ProgressFilledTrackProps, ProgressProps, ProgressTrackProps, useProgressStyles };

import * as react from 'react';
import { keyframes } from '@chakra-ui/system';

type Keyframe = ReturnType<typeof keyframes>;
declare const spin: Keyframe;
declare const rotate: Keyframe;
declare const progress: Keyframe;
declare const stripe: Keyframe;
interface GetProgressPropsOptions {
    value?: number;
    min: number;
    max: number;
    valueText?: string;
    getValueText?(value: number, percent: number): string;
    isIndeterminate?: boolean;
    role?: React.AriaRole;
}
/**
 * Get the common `aria-*` attributes for both the linear and circular
 * progress components.
 */
declare function getProgressProps(options: GetProgressPropsOptions): {
    bind: {
        "data-indeterminate": string | undefined;
        "aria-valuemax": number;
        "aria-valuemin": number;
        "aria-valuenow": number | undefined;
        "aria-valuetext": string | undefined;
        role: react.AriaRole;
    };
    percent: number;
    value: number;
};

export { GetProgressPropsOptions, getProgressProps, progress, rotate, spin, stripe };

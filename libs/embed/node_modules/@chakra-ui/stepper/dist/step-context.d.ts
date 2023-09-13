import * as _chakra_ui_system from '@chakra-ui/system';
import * as react from 'react';

type StepStatusType = "active" | "complete" | "incomplete";
type Orientation = "horizontal" | "vertical";
interface StepContext {
    /**
     * The status of the step
     * @type "active" | "complete" | "incomplete"
     */
    status: StepStatusType;
    /**
     * The total number of steps
     */
    count: number;
    /**
     * The index of the step
     */
    index: number;
    /**
     * The orientation of the stepper
     */
    orientation: Orientation;
    /**
     * Whether the step is the last step
     */
    isLast: boolean;
    /**
     * Whether the step is the first step
     */
    isFirst: boolean;
    /**
     * Whether to show or not the last separator while in vertical orientation
     */
    showLastSeparator?: boolean;
}
declare const StepContextProvider: react.Provider<StepContext>;
declare const useStepContext: () => StepContext;
declare const StepperStylesProvider: react.Provider<Record<string, _chakra_ui_system.SystemStyleObject>>;
declare const useStepperStyles: () => Record<string, _chakra_ui_system.SystemStyleObject>;

export { Orientation, StepContext, StepContextProvider, StepStatusType, StepperStylesProvider, useStepContext, useStepperStyles };

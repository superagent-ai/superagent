import * as react from 'react';

type UseStepsProps = {
    index?: number;
    count?: number;
};
type StepStatus = "complete" | "active" | "incomplete";
declare function useSteps(props?: UseStepsProps): {
    activeStep: number;
    setActiveStep: react.Dispatch<react.SetStateAction<number>>;
    activeStepPercent: number;
    isActiveStep(step: number): boolean;
    isCompleteStep(step: number): boolean;
    isIncompleteStep(step: number): boolean;
    getStatus(step: number): StepStatus;
    goToNext(): void;
    goToPrevious(): void;
};
type UseStepsReturn = ReturnType<typeof useSteps>;

export { StepStatus, UseStepsProps, UseStepsReturn, useSteps };

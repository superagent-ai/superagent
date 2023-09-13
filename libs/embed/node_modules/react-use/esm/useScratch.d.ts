import { FC } from 'react';
export interface ScratchSensorParams {
    disabled?: boolean;
    onScratch?: (state: ScratchSensorState) => void;
    onScratchStart?: (state: ScratchSensorState) => void;
    onScratchEnd?: (state: ScratchSensorState) => void;
}
export interface ScratchSensorState {
    isScratching: boolean;
    start?: number;
    end?: number;
    x?: number;
    y?: number;
    dx?: number;
    dy?: number;
    docX?: number;
    docY?: number;
    posX?: number;
    posY?: number;
    elH?: number;
    elW?: number;
    elX?: number;
    elY?: number;
}
declare const useScratch: (params?: ScratchSensorParams) => [(el: HTMLElement | null) => void, ScratchSensorState];
export interface ScratchSensorProps extends ScratchSensorParams {
    children: (state: ScratchSensorState, ref: (el: HTMLElement | null) => void) => React.ReactElement<any>;
}
export declare const ScratchSensor: FC<ScratchSensorProps>;
export default useScratch;

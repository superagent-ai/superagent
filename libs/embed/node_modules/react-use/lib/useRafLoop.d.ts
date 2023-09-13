export declare type RafLoopReturns = [() => void, () => void, () => boolean];
export default function useRafLoop(callback: FrameRequestCallback, initiallyActive?: boolean): RafLoopReturns;

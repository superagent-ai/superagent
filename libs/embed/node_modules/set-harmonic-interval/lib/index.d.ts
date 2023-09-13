export declare type Listener = () => void;
export declare type ClearHarmonicInterval = () => void;
export interface Bucket {
    ms: number;
    timer: any;
    listeners: Record<number, Listener>;
}
export interface TimerReference {
    bucket: Bucket;
    id: number;
}
export declare const setHarmonicInterval: (fn: Listener, ms: number) => TimerReference;
export declare const clearHarmonicInterval: ({ bucket, id }: TimerReference) => void;

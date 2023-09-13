export declare type Race = <P extends Promise<any>, E = any>(promise: P, onError?: (error: E) => void) => P;
declare const useUnmountPromise: () => Race;
export default useUnmountPromise;

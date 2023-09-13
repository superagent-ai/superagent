declare const useLatest: <T>(value: T) => {
    readonly current: T;
};
export default useLatest;

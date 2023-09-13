type UseAnimationStateProps = {
    isOpen: boolean;
    ref: React.RefObject<HTMLElement>;
};
declare function useAnimationState(props: UseAnimationStateProps): {
    present: boolean;
    onComplete(): void;
};

export { UseAnimationStateProps, useAnimationState };

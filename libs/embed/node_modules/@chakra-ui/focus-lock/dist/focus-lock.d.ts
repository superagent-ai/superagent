interface FocusableElement {
    focus(options?: FocusOptions): void;
}
interface FocusLockProps {
    /**
     * `ref` of the element to receive focus initially
     */
    initialFocusRef?: React.RefObject<FocusableElement>;
    /**
     * `ref` of the element to return focus to when `FocusLock`
     * unmounts
     */
    finalFocusRef?: React.RefObject<FocusableElement>;
    /**
     * The `ref` of the wrapper for which the focus-lock wraps
     */
    contentRef?: React.RefObject<HTMLElement>;
    /**
     * If `true`, focus will be restored to the element that
     * triggered the `FocusLock` once it unmounts
     *
     * @default false
     */
    restoreFocus?: boolean;
    /**
     * The component to render
     */
    children: React.ReactNode;
    /**
     * If `true`, focus trapping will be disabled
     *
     * @default false
     */
    isDisabled?: boolean;
    /**
     * If `true`, the first focusable element within the `children`
     * will auto-focused once `FocusLock` mounts
     *
     * @default false
     */
    autoFocus?: boolean;
    /**
     * If `true`, disables text selections inside, and outside focus lock
     *
     * @default false
     */
    persistentFocus?: boolean;
    /**
     * Enables aggressive focus capturing within iframes.
     * - If `true`: keep focus in the lock, no matter where lock is active
     * - If `false`:  allows focus to move outside of iframe
     *
     * @default false
     */
    lockFocusAcrossFrames?: boolean;
}
declare const FocusLock: React.FC<FocusLockProps>;

export { FocusLock, FocusLockProps, FocusLock as default };

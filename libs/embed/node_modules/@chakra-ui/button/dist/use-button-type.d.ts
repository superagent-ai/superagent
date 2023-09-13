declare function useButtonType(value?: React.ElementType): {
    readonly ref: (node: HTMLElement | null) => void;
    readonly type: "button" | undefined;
};

export { useButtonType };

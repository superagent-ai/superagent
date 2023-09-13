/**
 * React hook use to gain access to the editable state and actions.
 */
declare function useEditableState(): {
    isEditing: boolean;
    onSubmit: () => void;
    onCancel: () => void;
    onEdit: () => void;
    isDisabled: boolean | undefined;
};

export { useEditableState };

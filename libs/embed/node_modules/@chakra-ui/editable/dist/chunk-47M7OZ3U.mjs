'use client'
import {
  useEditableContext
} from "./chunk-WYY72ITE.mjs";

// src/use-editable-state.tsx
function useEditableState() {
  const { isEditing, onSubmit, onCancel, onEdit, isDisabled } = useEditableContext();
  return {
    isEditing,
    onSubmit,
    onCancel,
    onEdit,
    isDisabled
  };
}

export {
  useEditableState
};
//# sourceMappingURL=chunk-47M7OZ3U.mjs.map
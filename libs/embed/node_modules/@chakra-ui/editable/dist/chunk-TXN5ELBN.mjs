'use client'

// src/use-editable.ts
import { useFocusOnPointerDown } from "@chakra-ui/react-use-focus-on-pointer-down";
import { useSafeLayoutEffect } from "@chakra-ui/react-use-safe-layout-effect";
import { useUpdateEffect } from "@chakra-ui/react-use-update-effect";
import { useControllableState } from "@chakra-ui/react-use-controllable-state";
import { mergeRefs } from "@chakra-ui/react-use-merge-refs";
import { useCallbackRef } from "@chakra-ui/react-use-callback-ref";
import { ariaAttr, callAllHandlers } from "@chakra-ui/shared-utils";
import { useCallback, useEffect, useRef, useState } from "react";
function contains(parent, child) {
  if (!parent)
    return false;
  return parent === child || parent.contains(child);
}
function useEditable(props = {}) {
  const {
    onChange: onChangeProp,
    onCancel: onCancelProp,
    onSubmit: onSubmitProp,
    onBlur: onBlurProp,
    value: valueProp,
    isDisabled,
    defaultValue,
    startWithEditView,
    isPreviewFocusable = true,
    submitOnBlur = true,
    selectAllOnFocus = true,
    placeholder,
    onEdit: onEditCallback,
    finalFocusRef,
    ...htmlProps
  } = props;
  const onEditProp = useCallbackRef(onEditCallback);
  const defaultIsEditing = Boolean(startWithEditView && !isDisabled);
  const [isEditing, setIsEditing] = useState(defaultIsEditing);
  const [value, setValue] = useControllableState({
    defaultValue: defaultValue || "",
    value: valueProp,
    onChange: onChangeProp
  });
  const [prevValue, setPrevValue] = useState(value);
  const inputRef = useRef(null);
  const previewRef = useRef(null);
  const editButtonRef = useRef(null);
  const cancelButtonRef = useRef(null);
  const submitButtonRef = useRef(null);
  useFocusOnPointerDown({
    ref: inputRef,
    enabled: isEditing,
    elements: [cancelButtonRef, submitButtonRef]
  });
  const isInteractive = !isEditing && !isDisabled;
  useSafeLayoutEffect(() => {
    var _a, _b;
    if (isEditing) {
      (_a = inputRef.current) == null ? void 0 : _a.focus();
      if (selectAllOnFocus)
        (_b = inputRef.current) == null ? void 0 : _b.select();
    }
  }, []);
  useUpdateEffect(() => {
    var _a, _b, _c, _d;
    if (!isEditing) {
      if (finalFocusRef) {
        (_a = finalFocusRef.current) == null ? void 0 : _a.focus();
      } else {
        (_b = editButtonRef.current) == null ? void 0 : _b.focus();
      }
      return;
    }
    (_c = inputRef.current) == null ? void 0 : _c.focus();
    if (selectAllOnFocus) {
      (_d = inputRef.current) == null ? void 0 : _d.select();
    }
    onEditProp == null ? void 0 : onEditProp();
  }, [isEditing, onEditProp, selectAllOnFocus]);
  const onEdit = useCallback(() => {
    if (isInteractive) {
      setIsEditing(true);
    }
  }, [isInteractive]);
  const onUpdatePrevValue = useCallback(() => {
    setPrevValue(value);
  }, [value]);
  const onCancel = useCallback(() => {
    setIsEditing(false);
    setValue(prevValue);
    onCancelProp == null ? void 0 : onCancelProp(prevValue);
    onBlurProp == null ? void 0 : onBlurProp(prevValue);
  }, [onCancelProp, onBlurProp, setValue, prevValue]);
  const onSubmit = useCallback(() => {
    setIsEditing(false);
    setPrevValue(value);
    onSubmitProp == null ? void 0 : onSubmitProp(value);
    onBlurProp == null ? void 0 : onBlurProp(prevValue);
  }, [value, onSubmitProp, onBlurProp, prevValue]);
  useEffect(() => {
    if (isEditing)
      return;
    const inputEl = inputRef.current;
    if ((inputEl == null ? void 0 : inputEl.ownerDocument.activeElement) === inputEl) {
      inputEl == null ? void 0 : inputEl.blur();
    }
  }, [isEditing]);
  const onChange = useCallback(
    (event) => {
      setValue(event.currentTarget.value);
    },
    [setValue]
  );
  const onKeyDown = useCallback(
    (event) => {
      const eventKey = event.key;
      const keyMap = {
        Escape: onCancel,
        Enter: (event2) => {
          if (!event2.shiftKey && !event2.metaKey) {
            onSubmit();
          }
        }
      };
      const action = keyMap[eventKey];
      if (action) {
        event.preventDefault();
        action(event);
      }
    },
    [onCancel, onSubmit]
  );
  const onKeyDownWithoutSubmit = useCallback(
    (event) => {
      const eventKey = event.key;
      const keyMap = {
        Escape: onCancel
      };
      const action = keyMap[eventKey];
      if (action) {
        event.preventDefault();
        action(event);
      }
    },
    [onCancel]
  );
  const isValueEmpty = value.length === 0;
  const onBlur = useCallback(
    (event) => {
      var _a;
      if (!isEditing)
        return;
      const doc = event.currentTarget.ownerDocument;
      const relatedTarget = (_a = event.relatedTarget) != null ? _a : doc.activeElement;
      const targetIsCancel = contains(cancelButtonRef.current, relatedTarget);
      const targetIsSubmit = contains(submitButtonRef.current, relatedTarget);
      const isValidBlur = !targetIsCancel && !targetIsSubmit;
      if (isValidBlur) {
        if (submitOnBlur) {
          onSubmit();
        } else {
          onCancel();
        }
      }
    },
    [submitOnBlur, onSubmit, onCancel, isEditing]
  );
  const getPreviewProps = useCallback(
    (props2 = {}, ref = null) => {
      const tabIndex = isInteractive && isPreviewFocusable ? 0 : void 0;
      return {
        ...props2,
        ref: mergeRefs(ref, previewRef),
        children: isValueEmpty ? placeholder : value,
        hidden: isEditing,
        "aria-disabled": ariaAttr(isDisabled),
        tabIndex,
        onFocus: callAllHandlers(props2.onFocus, onEdit, onUpdatePrevValue)
      };
    },
    [
      isDisabled,
      isEditing,
      isInteractive,
      isPreviewFocusable,
      isValueEmpty,
      onEdit,
      onUpdatePrevValue,
      placeholder,
      value
    ]
  );
  const getInputProps = useCallback(
    (props2 = {}, ref = null) => ({
      ...props2,
      hidden: !isEditing,
      placeholder,
      ref: mergeRefs(ref, inputRef),
      disabled: isDisabled,
      "aria-disabled": ariaAttr(isDisabled),
      value,
      onBlur: callAllHandlers(props2.onBlur, onBlur),
      onChange: callAllHandlers(props2.onChange, onChange),
      onKeyDown: callAllHandlers(props2.onKeyDown, onKeyDown),
      onFocus: callAllHandlers(props2.onFocus, onUpdatePrevValue)
    }),
    [
      isDisabled,
      isEditing,
      onBlur,
      onChange,
      onKeyDown,
      onUpdatePrevValue,
      placeholder,
      value
    ]
  );
  const getTextareaProps = useCallback(
    (props2 = {}, ref = null) => ({
      ...props2,
      hidden: !isEditing,
      placeholder,
      ref: mergeRefs(ref, inputRef),
      disabled: isDisabled,
      "aria-disabled": ariaAttr(isDisabled),
      value,
      onBlur: callAllHandlers(props2.onBlur, onBlur),
      onChange: callAllHandlers(props2.onChange, onChange),
      onKeyDown: callAllHandlers(props2.onKeyDown, onKeyDownWithoutSubmit),
      onFocus: callAllHandlers(props2.onFocus, onUpdatePrevValue)
    }),
    [
      isDisabled,
      isEditing,
      onBlur,
      onChange,
      onKeyDownWithoutSubmit,
      onUpdatePrevValue,
      placeholder,
      value
    ]
  );
  const getEditButtonProps = useCallback(
    (props2 = {}, ref = null) => ({
      "aria-label": "Edit",
      ...props2,
      type: "button",
      onClick: callAllHandlers(props2.onClick, onEdit),
      ref: mergeRefs(ref, editButtonRef),
      disabled: isDisabled
    }),
    [onEdit, isDisabled]
  );
  const getSubmitButtonProps = useCallback(
    (props2 = {}, ref = null) => ({
      ...props2,
      "aria-label": "Submit",
      ref: mergeRefs(submitButtonRef, ref),
      type: "button",
      onClick: callAllHandlers(props2.onClick, onSubmit),
      disabled: isDisabled
    }),
    [onSubmit, isDisabled]
  );
  const getCancelButtonProps = useCallback(
    (props2 = {}, ref = null) => ({
      "aria-label": "Cancel",
      id: "cancel",
      ...props2,
      ref: mergeRefs(cancelButtonRef, ref),
      type: "button",
      onClick: callAllHandlers(props2.onClick, onCancel),
      disabled: isDisabled
    }),
    [onCancel, isDisabled]
  );
  return {
    isEditing,
    isDisabled,
    isValueEmpty,
    value,
    onEdit,
    onCancel,
    onSubmit,
    getPreviewProps,
    getInputProps,
    getTextareaProps,
    getEditButtonProps,
    getSubmitButtonProps,
    getCancelButtonProps,
    htmlProps
  };
}

export {
  useEditable
};
//# sourceMappingURL=chunk-TXN5ELBN.mjs.map
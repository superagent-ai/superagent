'use client'
"use strict";
var __defProp = Object.defineProperty;
var __getOwnPropDesc = Object.getOwnPropertyDescriptor;
var __getOwnPropNames = Object.getOwnPropertyNames;
var __hasOwnProp = Object.prototype.hasOwnProperty;
var __export = (target, all) => {
  for (var name in all)
    __defProp(target, name, { get: all[name], enumerable: true });
};
var __copyProps = (to, from, except, desc) => {
  if (from && typeof from === "object" || typeof from === "function") {
    for (let key of __getOwnPropNames(from))
      if (!__hasOwnProp.call(to, key) && key !== except)
        __defProp(to, key, { get: () => from[key], enumerable: !(desc = __getOwnPropDesc(from, key)) || desc.enumerable });
  }
  return to;
};
var __toCommonJS = (mod) => __copyProps(__defProp({}, "__esModule", { value: true }), mod);

// src/use-editable.ts
var use_editable_exports = {};
__export(use_editable_exports, {
  useEditable: () => useEditable
});
module.exports = __toCommonJS(use_editable_exports);
var import_react_use_focus_on_pointer_down = require("@chakra-ui/react-use-focus-on-pointer-down");
var import_react_use_safe_layout_effect = require("@chakra-ui/react-use-safe-layout-effect");
var import_react_use_update_effect = require("@chakra-ui/react-use-update-effect");
var import_react_use_controllable_state = require("@chakra-ui/react-use-controllable-state");
var import_react_use_merge_refs = require("@chakra-ui/react-use-merge-refs");
var import_react_use_callback_ref = require("@chakra-ui/react-use-callback-ref");
var import_shared_utils = require("@chakra-ui/shared-utils");
var import_react = require("react");
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
  const onEditProp = (0, import_react_use_callback_ref.useCallbackRef)(onEditCallback);
  const defaultIsEditing = Boolean(startWithEditView && !isDisabled);
  const [isEditing, setIsEditing] = (0, import_react.useState)(defaultIsEditing);
  const [value, setValue] = (0, import_react_use_controllable_state.useControllableState)({
    defaultValue: defaultValue || "",
    value: valueProp,
    onChange: onChangeProp
  });
  const [prevValue, setPrevValue] = (0, import_react.useState)(value);
  const inputRef = (0, import_react.useRef)(null);
  const previewRef = (0, import_react.useRef)(null);
  const editButtonRef = (0, import_react.useRef)(null);
  const cancelButtonRef = (0, import_react.useRef)(null);
  const submitButtonRef = (0, import_react.useRef)(null);
  (0, import_react_use_focus_on_pointer_down.useFocusOnPointerDown)({
    ref: inputRef,
    enabled: isEditing,
    elements: [cancelButtonRef, submitButtonRef]
  });
  const isInteractive = !isEditing && !isDisabled;
  (0, import_react_use_safe_layout_effect.useSafeLayoutEffect)(() => {
    var _a, _b;
    if (isEditing) {
      (_a = inputRef.current) == null ? void 0 : _a.focus();
      if (selectAllOnFocus)
        (_b = inputRef.current) == null ? void 0 : _b.select();
    }
  }, []);
  (0, import_react_use_update_effect.useUpdateEffect)(() => {
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
  const onEdit = (0, import_react.useCallback)(() => {
    if (isInteractive) {
      setIsEditing(true);
    }
  }, [isInteractive]);
  const onUpdatePrevValue = (0, import_react.useCallback)(() => {
    setPrevValue(value);
  }, [value]);
  const onCancel = (0, import_react.useCallback)(() => {
    setIsEditing(false);
    setValue(prevValue);
    onCancelProp == null ? void 0 : onCancelProp(prevValue);
    onBlurProp == null ? void 0 : onBlurProp(prevValue);
  }, [onCancelProp, onBlurProp, setValue, prevValue]);
  const onSubmit = (0, import_react.useCallback)(() => {
    setIsEditing(false);
    setPrevValue(value);
    onSubmitProp == null ? void 0 : onSubmitProp(value);
    onBlurProp == null ? void 0 : onBlurProp(prevValue);
  }, [value, onSubmitProp, onBlurProp, prevValue]);
  (0, import_react.useEffect)(() => {
    if (isEditing)
      return;
    const inputEl = inputRef.current;
    if ((inputEl == null ? void 0 : inputEl.ownerDocument.activeElement) === inputEl) {
      inputEl == null ? void 0 : inputEl.blur();
    }
  }, [isEditing]);
  const onChange = (0, import_react.useCallback)(
    (event) => {
      setValue(event.currentTarget.value);
    },
    [setValue]
  );
  const onKeyDown = (0, import_react.useCallback)(
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
  const onKeyDownWithoutSubmit = (0, import_react.useCallback)(
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
  const onBlur = (0, import_react.useCallback)(
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
  const getPreviewProps = (0, import_react.useCallback)(
    (props2 = {}, ref = null) => {
      const tabIndex = isInteractive && isPreviewFocusable ? 0 : void 0;
      return {
        ...props2,
        ref: (0, import_react_use_merge_refs.mergeRefs)(ref, previewRef),
        children: isValueEmpty ? placeholder : value,
        hidden: isEditing,
        "aria-disabled": (0, import_shared_utils.ariaAttr)(isDisabled),
        tabIndex,
        onFocus: (0, import_shared_utils.callAllHandlers)(props2.onFocus, onEdit, onUpdatePrevValue)
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
  const getInputProps = (0, import_react.useCallback)(
    (props2 = {}, ref = null) => ({
      ...props2,
      hidden: !isEditing,
      placeholder,
      ref: (0, import_react_use_merge_refs.mergeRefs)(ref, inputRef),
      disabled: isDisabled,
      "aria-disabled": (0, import_shared_utils.ariaAttr)(isDisabled),
      value,
      onBlur: (0, import_shared_utils.callAllHandlers)(props2.onBlur, onBlur),
      onChange: (0, import_shared_utils.callAllHandlers)(props2.onChange, onChange),
      onKeyDown: (0, import_shared_utils.callAllHandlers)(props2.onKeyDown, onKeyDown),
      onFocus: (0, import_shared_utils.callAllHandlers)(props2.onFocus, onUpdatePrevValue)
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
  const getTextareaProps = (0, import_react.useCallback)(
    (props2 = {}, ref = null) => ({
      ...props2,
      hidden: !isEditing,
      placeholder,
      ref: (0, import_react_use_merge_refs.mergeRefs)(ref, inputRef),
      disabled: isDisabled,
      "aria-disabled": (0, import_shared_utils.ariaAttr)(isDisabled),
      value,
      onBlur: (0, import_shared_utils.callAllHandlers)(props2.onBlur, onBlur),
      onChange: (0, import_shared_utils.callAllHandlers)(props2.onChange, onChange),
      onKeyDown: (0, import_shared_utils.callAllHandlers)(props2.onKeyDown, onKeyDownWithoutSubmit),
      onFocus: (0, import_shared_utils.callAllHandlers)(props2.onFocus, onUpdatePrevValue)
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
  const getEditButtonProps = (0, import_react.useCallback)(
    (props2 = {}, ref = null) => ({
      "aria-label": "Edit",
      ...props2,
      type: "button",
      onClick: (0, import_shared_utils.callAllHandlers)(props2.onClick, onEdit),
      ref: (0, import_react_use_merge_refs.mergeRefs)(ref, editButtonRef),
      disabled: isDisabled
    }),
    [onEdit, isDisabled]
  );
  const getSubmitButtonProps = (0, import_react.useCallback)(
    (props2 = {}, ref = null) => ({
      ...props2,
      "aria-label": "Submit",
      ref: (0, import_react_use_merge_refs.mergeRefs)(submitButtonRef, ref),
      type: "button",
      onClick: (0, import_shared_utils.callAllHandlers)(props2.onClick, onSubmit),
      disabled: isDisabled
    }),
    [onSubmit, isDisabled]
  );
  const getCancelButtonProps = (0, import_react.useCallback)(
    (props2 = {}, ref = null) => ({
      "aria-label": "Cancel",
      id: "cancel",
      ...props2,
      ref: (0, import_react_use_merge_refs.mergeRefs)(cancelButtonRef, ref),
      type: "button",
      onClick: (0, import_shared_utils.callAllHandlers)(props2.onClick, onCancel),
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
// Annotate the CommonJS export names for ESM import in node:
0 && (module.exports = {
  useEditable
});
//# sourceMappingURL=use-editable.js.map
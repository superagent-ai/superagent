import {
  useId
} from "./chunk-EGV7XMQK.mjs";
import {
  useControllableProp
} from "./chunk-NUQE4USX.mjs";
import {
  useCallbackRef
} from "./chunk-TFWETJDV.mjs";

// src/use-disclosure.ts
import { callAllHandlers } from "@chakra-ui/utils";
import { useCallback, useState } from "react";
function useDisclosure(props = {}) {
  const {
    onClose: onCloseProp,
    onOpen: onOpenProp,
    isOpen: isOpenProp,
    id: idProp
  } = props;
  const onOpenPropCallbackRef = useCallbackRef(onOpenProp);
  const onClosePropCallbackRef = useCallbackRef(onCloseProp);
  const [isOpenState, setIsOpen] = useState(props.defaultIsOpen || false);
  const [isControlled, isOpen] = useControllableProp(isOpenProp, isOpenState);
  const id = useId(idProp, "disclosure");
  const onClose = useCallback(() => {
    if (!isControlled) {
      setIsOpen(false);
    }
    onClosePropCallbackRef == null ? void 0 : onClosePropCallbackRef();
  }, [isControlled, onClosePropCallbackRef]);
  const onOpen = useCallback(() => {
    if (!isControlled) {
      setIsOpen(true);
    }
    onOpenPropCallbackRef == null ? void 0 : onOpenPropCallbackRef();
  }, [isControlled, onOpenPropCallbackRef]);
  const onToggle = useCallback(() => {
    const action = isOpen ? onClose : onOpen;
    action();
  }, [isOpen, onOpen, onClose]);
  return {
    isOpen: !!isOpen,
    onOpen,
    onClose,
    onToggle,
    isControlled,
    getButtonProps: (props2 = {}) => ({
      ...props2,
      "aria-expanded": isOpen,
      "aria-controls": id,
      onClick: callAllHandlers(props2.onClick, onToggle)
    }),
    getDisclosureProps: (props2 = {}) => ({
      ...props2,
      hidden: !isOpen,
      id
    })
  };
}

export {
  useDisclosure
};

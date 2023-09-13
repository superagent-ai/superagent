interface UseDisclosureProps {
    isOpen?: boolean;
    defaultIsOpen?: boolean;
    onClose?(): void;
    onOpen?(): void;
    id?: string;
}
declare function useDisclosure(props?: UseDisclosureProps): {
    isOpen: boolean;
    onOpen: () => void;
    onClose: () => void;
    onToggle: () => void;
    isControlled: boolean;
    getButtonProps: (props?: any) => any;
    getDisclosureProps: (props?: any) => any;
};
type UseDisclosureReturn = ReturnType<typeof useDisclosure>;

export { UseDisclosureProps, UseDisclosureReturn, useDisclosure };

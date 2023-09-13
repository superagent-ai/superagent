import React from 'react';

interface UseDisclosureProps {
    isOpen?: boolean;
    defaultIsOpen?: boolean;
    onClose?(): void;
    onOpen?(): void;
    id?: string;
}
type HTMLProps = React.HTMLAttributes<HTMLElement>;
/**
 * `useDisclosure` is a custom hook used to help handle common open, close, or toggle scenarios.
 * It can be used to control feedback component such as `Modal`, `AlertDialog`, `Drawer`, etc.
 *
 * @see Docs https://chakra-ui.com/docs/hooks/use-disclosure
 */
declare function useDisclosure(props?: UseDisclosureProps): {
    isOpen: boolean;
    onOpen: () => void;
    onClose: () => void;
    onToggle: () => void;
    isControlled: boolean;
    getButtonProps: (props?: HTMLProps) => HTMLProps;
    getDisclosureProps: (props?: HTMLProps) => HTMLProps;
};
type UseDisclosureReturn = ReturnType<typeof useDisclosure>;

export { UseDisclosureProps, UseDisclosureReturn, useDisclosure };

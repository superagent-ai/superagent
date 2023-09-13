import { RefObject } from 'react';

/**
 * Proper state management for nested modals.
 * Simplified, but inspired by material-ui's ModalManager class.
 */
declare class ModalManager {
    modals: Map<HTMLElement, number>;
    constructor();
    add(modal: HTMLElement): number;
    remove(modal: HTMLElement): void;
    isTopModal(modal: HTMLElement | null): boolean;
}
declare const modalManager: ModalManager;
declare function useModalManager(ref: RefObject<HTMLElement>, isOpen?: boolean): number;

export { modalManager, useModalManager };

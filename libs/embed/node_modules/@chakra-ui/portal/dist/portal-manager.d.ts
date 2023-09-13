interface PortalManagerContext {
    zIndex?: number;
}
declare const usePortalManager: () => PortalManagerContext | null;

interface PortalManagerProps {
    children?: React.ReactNode;
    /**
     * [Z-Index war] If your has multiple elements
     * with z-index clashing, you might need to apply a z-index to the Portal manager
     */
    zIndex?: number;
}
declare function PortalManager(props: PortalManagerProps): JSX.Element;
declare namespace PortalManager {
    var displayName: string;
}

export { PortalManager, PortalManagerProps, usePortalManager };

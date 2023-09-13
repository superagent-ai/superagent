import { ForwardRefExoticComponent, MutableRefObject, PropsWithoutRef, RefAttributes, RefForwardingComponent } from 'react';
export default function useEnsuredForwardedRef<T>(forwardedRef: MutableRefObject<T>): MutableRefObject<T>;
export declare function ensuredForwardRef<T, P = {}>(Component: RefForwardingComponent<T, P>): ForwardRefExoticComponent<PropsWithoutRef<P> & RefAttributes<T>>;

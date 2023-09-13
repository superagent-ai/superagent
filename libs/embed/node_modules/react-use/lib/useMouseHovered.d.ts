import { RefObject } from 'react';
import { State } from './useMouse';
export interface UseMouseHoveredOptions {
    whenHovered?: boolean;
    bound?: boolean;
}
declare const useMouseHovered: (ref: RefObject<Element>, options?: UseMouseHoveredOptions) => State;
export default useMouseHovered;

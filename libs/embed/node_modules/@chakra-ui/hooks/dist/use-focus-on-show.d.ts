import { FocusableElement } from '@chakra-ui/utils';

interface UseFocusOnShowOptions {
    visible?: boolean;
    shouldFocus?: boolean;
    preventScroll?: boolean;
    focusRef?: React.RefObject<FocusableElement>;
}
declare function useFocusOnShow<T extends HTMLElement>(target: React.RefObject<T> | T, options?: UseFocusOnShowOptions): void;

export { UseFocusOnShowOptions, useFocusOnShow };

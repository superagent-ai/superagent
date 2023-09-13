import { CSSProperties, RefObject } from 'react';
export interface State {
    isSliding: boolean;
    value: number;
}
export interface Options {
    onScrub: (value: number) => void;
    onScrubStart: () => void;
    onScrubStop: (value: number) => void;
    reverse: boolean;
    styles: boolean | CSSProperties;
    vertical?: boolean;
}
declare const useSlider: (ref: RefObject<HTMLElement>, options?: Partial<Options>) => State;
export default useSlider;

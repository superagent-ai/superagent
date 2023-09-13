import { ElementSize } from "./track-size";
export type TrackElementsSizeOptions<T extends HTMLElement | null> = {
    getNodes: () => T[];
    observeMutation?: boolean;
    callback: (size: ElementSize | undefined, index: number) => void;
};
export declare function trackElementsSize<T extends HTMLElement | null>(options: TrackElementsSizeOptions<T>): () => void;

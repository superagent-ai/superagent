import * as react from 'react';

declare function getIds(id: string | number): {
    root: string;
    getThumb: (i: number) => string;
    getInput: (i: number) => string;
    track: string;
    innerTrack: string;
    getMarker: (i: number) => string;
    output: string;
};
type Orientation = "vertical" | "horizontal";
declare function orient(options: {
    orientation: Orientation;
    vertical: React.CSSProperties;
    horizontal: React.CSSProperties;
}): react.CSSProperties;
type Size = {
    height: number;
    width: number;
};
declare function getStyles(options: {
    orientation: Orientation;
    thumbPercents: number[];
    thumbRects: Array<Size | undefined>;
    isReversed?: boolean;
}): {
    trackStyle: react.CSSProperties;
    innerTrackStyle: react.CSSProperties;
    rootStyle: react.CSSProperties;
    getThumbStyle: (i: number) => React.CSSProperties;
};
declare function getIsReversed(options: {
    isReversed?: boolean;
    direction: "ltr" | "rtl";
    orientation?: "horizontal" | "vertical";
}): boolean | undefined;

export { getIds, getIsReversed, getStyles, orient };

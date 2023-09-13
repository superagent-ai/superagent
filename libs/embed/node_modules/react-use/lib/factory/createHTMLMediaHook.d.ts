import * as React from 'react';
export interface HTMLMediaProps extends React.AudioHTMLAttributes<any>, React.VideoHTMLAttributes<any> {
    src: string;
}
export interface HTMLMediaState {
    buffered: any[];
    duration: number;
    paused: boolean;
    muted: boolean;
    time: number;
    volume: number;
    playing: boolean;
}
export interface HTMLMediaControls {
    play: () => Promise<void> | void;
    pause: () => void;
    mute: () => void;
    unmute: () => void;
    volume: (volume: number) => void;
    seek: (time: number) => void;
}
declare type MediaPropsWithRef<T> = HTMLMediaProps & {
    ref?: React.MutableRefObject<T | null>;
};
export default function createHTMLMediaHook<T extends HTMLAudioElement | HTMLVideoElement>(tag: 'audio' | 'video'): (elOrProps: HTMLMediaProps | React.ReactElement<HTMLMediaProps>) => readonly [React.ReactElement<MediaPropsWithRef<T>, string | ((props: any) => React.ReactElement<any, string | any | (new (props: any) => React.Component<any, any, any>)> | null) | (new (props: any) => React.Component<any, any, any>)>, HTMLMediaState, {
    play: () => Promise<void> | undefined;
    pause: () => void;
    seek: (time: number) => void;
    volume: (volume: number) => void;
    mute: () => void;
    unmute: () => void;
}, React.MutableRefObject<T | null>];
export {};

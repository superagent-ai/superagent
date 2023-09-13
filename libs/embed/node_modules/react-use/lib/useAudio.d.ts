/// <reference types="react" />
declare const useAudio: (elOrProps: import("./factory/createHTMLMediaHook").HTMLMediaProps | import("react").ReactElement<import("./factory/createHTMLMediaHook").HTMLMediaProps, string | ((props: any) => import("react").ReactElement<any, string | any | (new (props: any) => import("react").Component<any, any, any>)> | null) | (new (props: any) => import("react").Component<any, any, any>)>) => readonly [import("react").ReactElement<import("./factory/createHTMLMediaHook").HTMLMediaProps & {
    ref?: import("react").MutableRefObject<HTMLAudioElement | null> | undefined;
}, string | ((props: any) => import("react").ReactElement<any, string | any | (new (props: any) => import("react").Component<any, any, any>)> | null) | (new (props: any) => import("react").Component<any, any, any>)>, import("./factory/createHTMLMediaHook").HTMLMediaState, {
    play: () => Promise<void> | undefined;
    pause: () => void;
    seek: (time: number) => void;
    volume: (volume: number) => void;
    mute: () => void;
    unmute: () => void;
}, import("react").MutableRefObject<HTMLAudioElement | null>];
export default useAudio;

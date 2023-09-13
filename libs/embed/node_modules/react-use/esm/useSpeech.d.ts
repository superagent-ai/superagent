declare type SpeechOptions = {
    lang: string;
    voice?: SpeechSynthesisVoice;
    rate: number;
    pitch: number;
    volume: number;
};
export declare type ISpeechOptions = Partial<SpeechOptions>;
export declare type VoiceInfo = Pick<SpeechSynthesisVoice, 'lang' | 'name'>;
export declare type ISpeechState = SpeechOptions & {
    isPlaying: boolean;
    status: string;
    voiceInfo: VoiceInfo;
};
declare const useSpeech: (text: string, options: ISpeechOptions) => ISpeechState;
export default useSpeech;

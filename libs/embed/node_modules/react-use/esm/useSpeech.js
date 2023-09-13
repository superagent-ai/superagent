import { __assign } from "tslib";
import { useCallback, useEffect, useRef, useState } from 'react';
var Status;
(function (Status) {
    Status[Status["init"] = 0] = "init";
    Status[Status["play"] = 1] = "play";
    Status[Status["pause"] = 2] = "pause";
    Status[Status["end"] = 3] = "end";
})(Status || (Status = {}));
var useSpeech = function (text, options) {
    var mounted = useRef(false);
    var _a = useState(function () {
        var _a = options.voice || {}, _b = _a.lang, lang = _b === void 0 ? 'default' : _b, _c = _a.name, name = _c === void 0 ? '' : _c;
        return {
            isPlaying: false,
            status: Status[Status.init],
            lang: options.lang || 'default',
            voiceInfo: { lang: lang, name: name },
            rate: options.rate || 1,
            pitch: options.pitch || 1,
            volume: options.volume || 1,
        };
    }), state = _a[0], setState = _a[1];
    var handlePlay = useCallback(function () {
        if (!mounted.current) {
            return;
        }
        setState(function (preState) {
            return __assign(__assign({}, preState), { isPlaying: true, status: Status[Status.play] });
        });
    }, []);
    var handlePause = useCallback(function () {
        if (!mounted.current) {
            return;
        }
        setState(function (preState) {
            return __assign(__assign({}, preState), { isPlaying: false, status: Status[Status.pause] });
        });
    }, []);
    var handleEnd = useCallback(function () {
        if (!mounted.current) {
            return;
        }
        setState(function (preState) {
            return __assign(__assign({}, preState), { isPlaying: false, status: Status[Status.end] });
        });
    }, []);
    useEffect(function () {
        mounted.current = true;
        var utterance = new SpeechSynthesisUtterance(text);
        options.lang && (utterance.lang = options.lang);
        options.voice && (utterance.voice = options.voice);
        utterance.rate = options.rate || 1;
        utterance.pitch = options.pitch || 1;
        utterance.volume = options.volume || 1;
        utterance.onstart = handlePlay;
        utterance.onpause = handlePause;
        utterance.onresume = handlePlay;
        utterance.onend = handleEnd;
        window.speechSynthesis.speak(utterance);
        return function () {
            mounted.current = false;
        };
    }, []);
    return state;
};
export default useSpeech;

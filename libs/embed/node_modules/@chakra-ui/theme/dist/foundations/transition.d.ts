declare const transition: {
    property: {
        common: string;
        colors: string;
        dimensions: string;
        position: string;
        background: string;
    };
    easing: {
        "ease-in": string;
        "ease-out": string;
        "ease-in-out": string;
    };
    duration: {
        "ultra-fast": string;
        faster: string;
        fast: string;
        normal: string;
        slow: string;
        slower: string;
        "ultra-slow": string;
    };
};

export { transition as default };

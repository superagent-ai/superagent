interface LiveRegionOptions {
    /**
     * A unique id for the created live region element
     */
    id?: string;
    /**
     * Used to mark a part of the page as "live" so that updates will
     * be communicated to users by screen readers.
     *
     * - If set to `polite`: tells assistive technology to alert the user
     * to this change when it has finished whatever it is currently doing
     *
     * - If set to `assertive`: tells assistive technology to interrupt whatever
     * it is doing and alert the user to this change immediately
     *
     * @default "polite".
     */
    "aria-live"?: "polite" | "assertive";
    /**
     * The desired value of the role attribute
     * @default "status"
     */
    role?: "status" | "alert" | "log";
    /**
     * Indicates what types of changes should be presented to the user.
     * @default "all"
     */
    "aria-relevant"?: React.AriaAttributes["aria-relevant"];
    /**
     * Indicates whether the entire region should be
     * considered as a whole when communicating updates
     *
     * @default true
     */
    "aria-atomic"?: React.AriaAttributes["aria-atomic"];
    /**
     * The node to append the live region node to
     */
    parentNode?: HTMLElement;
}
declare class LiveRegion {
    region: HTMLElement | null;
    options: Required<LiveRegionOptions>;
    parentNode: HTMLElement;
    constructor(options?: LiveRegionOptions);
    speak(message: string): void;
    destroy(): void;
    clear(): void;
}

export { LiveRegion, LiveRegionOptions };

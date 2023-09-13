declare function getUserAgentBrowser(navigator: Navigator): "Chrome for iOS" | "Edge" | "Silk" | "Chrome" | "Firefox" | "AOSP" | "IE" | "Safari" | "WebKit" | null;
declare type UserAgentBrowser = NonNullable<ReturnType<typeof getUserAgentBrowser>>;
declare function getUserAgentOS(navigator: Navigator): "Android" | "iOS" | "Windows" | "Mac" | "Chrome OS" | "Firefox OS" | null;
declare type UserAgentOS = NonNullable<ReturnType<typeof getUserAgentOS>>;
declare function detectDeviceType(navigator: Navigator): "tablet" | "phone" | "desktop";
declare type UserAgentDeviceType = NonNullable<ReturnType<typeof detectDeviceType>>;
declare function detectOS(os: UserAgentOS): boolean;
declare function detectBrowser(browser: UserAgentBrowser): boolean;
declare function detectTouch(): boolean;

export { UserAgentBrowser, UserAgentDeviceType, UserAgentOS, detectBrowser, detectDeviceType, detectOS, detectTouch };

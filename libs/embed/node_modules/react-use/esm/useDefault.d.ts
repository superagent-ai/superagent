/// <reference types="react" />
declare const useDefault: <TStateType>(defaultValue: TStateType, initialValue: TStateType | (() => TStateType)) => readonly [TStateType, import("react").Dispatch<import("react").SetStateAction<TStateType | null | undefined>>];
export default useDefault;

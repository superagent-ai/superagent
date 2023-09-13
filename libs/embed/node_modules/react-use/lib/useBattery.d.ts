export interface BatteryState {
    charging: boolean;
    chargingTime: number;
    dischargingTime: number;
    level: number;
}
declare type UseBatteryState = {
    isSupported: false;
} | {
    isSupported: true;
    fetched: false;
} | (BatteryState & {
    isSupported: true;
    fetched: true;
});
declare function useBattery(): UseBatteryState;
declare const _default: typeof useBattery;
export default _default;

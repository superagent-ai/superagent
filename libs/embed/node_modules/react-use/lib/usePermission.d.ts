export declare type IState = PermissionState | '';
interface IPushPermissionDescriptor extends PermissionDescriptor {
    name: 'push';
    userVisibleOnly?: boolean;
}
interface IMidiPermissionDescriptor extends PermissionDescriptor {
    name: 'midi';
    sysex?: boolean;
}
interface IDevicePermissionDescriptor extends PermissionDescriptor {
    name: 'camera' | 'microphone' | 'speaker';
    deviceId?: string;
}
export declare type IPermissionDescriptor = PermissionDescriptor | IPushPermissionDescriptor | IMidiPermissionDescriptor | IDevicePermissionDescriptor;
declare const usePermission: (permissionDesc: IPermissionDescriptor) => IState;
export default usePermission;

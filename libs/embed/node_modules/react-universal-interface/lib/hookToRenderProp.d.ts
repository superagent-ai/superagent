import { FC } from 'react';
export declare type MapPropsToArgs<Props extends {}, Args extends any[]> = (props: Props) => Args;
export declare type CreateRenderProp = <Props extends {}, Args extends any[], State extends any>(hook: (...args: Args) => State, mapPropsToArgs?: MapPropsToArgs<Props, Args>) => FC<Props>;
declare const hookToRenderProp: CreateRenderProp;
export default hookToRenderProp;

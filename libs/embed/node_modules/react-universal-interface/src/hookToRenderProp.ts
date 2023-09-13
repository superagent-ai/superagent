import {FC} from 'react';
import render from './render';

export type MapPropsToArgs<Props extends {}, Args extends any[]> = (props: Props) => Args;
export type CreateRenderProp = <Props extends {}, Args extends any[], State extends any>(hook: (...args: Args) => State, mapPropsToArgs?: MapPropsToArgs<Props, Args>) => FC<Props>;

const defaultMapPropsToArgs = props => [props];

const hookToRenderProp: CreateRenderProp = (hook, mapPropsToArgs = defaultMapPropsToArgs as any) =>
    props => render(props, hook(...mapPropsToArgs(props)));

export default hookToRenderProp;

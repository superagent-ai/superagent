import { Dispatch } from 'react';
import { IHookStateInitAction, IHookStateSetAction } from './misc/hookState';
export default function useGetSet<S>(initialState: IHookStateInitAction<S>): [get: () => S, set: Dispatch<IHookStateSetAction<S>>];

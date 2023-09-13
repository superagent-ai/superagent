import { DependencyList, EffectCallback } from 'react';
declare type DepsEqualFnType<TDeps extends DependencyList> = (prevDeps: TDeps, nextDeps: TDeps) => boolean;
declare const useCustomCompareEffect: <TDeps extends DependencyList>(effect: EffectCallback, deps: TDeps, depsEqual: DepsEqualFnType<TDeps>) => void;
export default useCustomCompareEffect;

import { ListActions } from './useList';
import { IHookStateInitAction } from './misc/hookState';
export interface UpsertListActions<T> extends Omit<ListActions<T>, 'upsert'> {
    upsert: (newItem: T) => void;
}
/**
 * @deprecated Use `useList` hook's upsert action instead
 */
export default function useUpsert<T>(predicate: (a: T, b: T) => boolean, initialList?: IHookStateInitAction<T[]>): [T[], UpsertListActions<T>];

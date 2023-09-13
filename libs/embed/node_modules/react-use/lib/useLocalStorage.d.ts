import { Dispatch, SetStateAction } from 'react';
declare const useLocalStorage: <T>(key: string, initialValue?: T | undefined, options?: {
    raw: true;
} | {
    raw: false;
    serializer: (value: T) => string;
    deserializer: (value: string) => T;
} | undefined) => [T | undefined, Dispatch<SetStateAction<T | undefined>>, () => void];
export default useLocalStorage;

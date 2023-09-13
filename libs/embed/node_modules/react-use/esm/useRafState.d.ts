import { Dispatch, SetStateAction } from 'react';
declare const useRafState: <S>(initialState: S | (() => S)) => [S, Dispatch<SetStateAction<S>>];
export default useRafState;

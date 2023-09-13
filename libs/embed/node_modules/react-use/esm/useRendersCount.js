import { useRef } from 'react';
export function useRendersCount() {
    return ++useRef(0).current;
}

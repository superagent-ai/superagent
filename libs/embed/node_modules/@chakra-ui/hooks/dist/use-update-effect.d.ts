import { useEffect } from 'react';

/**
 * React effect hook that invokes only on update.
 * It doesn't invoke on mount
 */
declare const useUpdateEffect: typeof useEffect;

export { useUpdateEffect };

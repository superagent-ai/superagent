import { useEffect, useLayoutEffect } from 'react';
import { isBrowser } from './misc/util';
var useIsomorphicLayoutEffect = isBrowser ? useLayoutEffect : useEffect;
export default useIsomorphicLayoutEffect;

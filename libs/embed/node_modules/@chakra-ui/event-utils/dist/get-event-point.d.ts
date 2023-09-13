import { AnyPointerEvent, PointType } from './types.js';

declare function getEventPoint(event: AnyPointerEvent, type?: PointType): {
    x: number;
    y: number;
};

export { getEventPoint };

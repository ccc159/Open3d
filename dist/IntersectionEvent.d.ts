import { Point3d } from './Point3d';
/**
 * Represents the values that describes the intersection relationship between two curve geometries.
 */
export declare class IntersectionEvent {
    ParameterA: number;
    ParameterB: number;
    PointA: Point3d;
    PointB: Point3d;
    constructor(tA: number, tB: number, pA: Point3d, pB: Point3d);
}

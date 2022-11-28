import { IntersectionEvent } from './intersectionEvent';
import { Line } from './Line';
import { Plane } from './Plane';
import { Point3d } from './Point3d';
/**
 * Provides static methods for the computation of intersections, projections, sections and similar.
 */
export declare class Intersection {
    private constructor();
    static LineLineTParameters(line1: Line, line2: Line): [number, number] | null;
    /**
     * Try to get an intersection point between this line and another line.
     * If there's no intersection, null is returned.
     * @param firstLine first Line Line to intersect with.
     * @param secondLine second Line to intersect with.
     * @param limitToFiniteSegment If true, the distance is limited to the finite line segment. default: false
     * @param distance (default is global tolerance) Distance between two lines to filter intersections. To include crossing lines, increase the distance
     * @returns The point at the intersetion, or null if there's no intersection.
     */
    static LineLine(firstLine: Line, secondLine: Line, limitToFiniteSegment?: boolean, distance?: number): Point3d | null;
    /**
     * Try to closest points between two lines.
     * If there's no valid crossing, null is returned.
     * @param firstLine first Line Line to intersect with.
     * @param secondLine second Line to intersect with.
     * @param limitToFiniteSegment If true, the distance is limited to the finite line segment. default: false
     * @param distance (default is Infinity) Distance between two lines to filter intersections. To include crossing lines, increase the distance
     * @returns The intersection event, or null if there's no intersection.
     */
    static CrossingLineLine(firstLine: Line, secondLine: Line, limitToFiniteSegment?: boolean, distance?: number): IntersectionEvent | null;
    /**
     * Intersects a line and a plane. This function only returns a single intersection point or null (i.e. if the line is coincident with the plane then no intersection is assumed).
     * @param line The line to intersect with.
     * @param plane The plane to intersect with.
     * @param limitToFiniteSegment If true, the intersection is limited to the finite line segment. default: false
     * @returns The intersection point.
     */
    static LinePlane(line: Line, plane: Plane, limitToFiniteSegment?: boolean): Point3d | null;
    /**
     * Intersects two planes and return the intersection line. If the planes are parallel or coincident, no intersection is assumed.
     * @param planeA First plane for intersection.
     * @param planeB Second plane for intersection.
     * @returns The intersection line or null.
     */
    static PlanePlane(planeA: Plane, planeB: Plane): Line | null;
    /**
     * Intersects three planes to find the single point they all share.
     * @param planeA First plane for intersection.
     * @param planeB Second plane for intersection.
     * @param planeC Third plane for intersection.
     * @returns The intersection point or null.
     */
    static PlanePlanePlane(planeA: Plane, planeB: Plane, planeC: Plane): Point3d | null;
}

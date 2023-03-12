import { Line } from './Line';
import { Point3dList } from './List';
import { Plane } from './Plane';
import { Point3d } from './Point3d';
import { Transform } from './Transform';
import { Vector3d } from './Vector3d';
/**
 * Represents an ordered set of points connected by linear segments.
 * @remarks The polyline is using the Array class as its base class. So you can use all Array methods on a polyline.
 * Polylines are closed if start and end points coincide.
 */
export declare class Polyline extends Point3dList {
    /**
     * Init a new polyline from a list of points.
     * @param points The points that define the polyline.
     */
    constructor(points: Point3d[]);
    /**
     * Compute the center point of the polyline as the weighted average of all segments.
     */
    get CenterPoint(): Point3d;
    /**
     * Gets a value that indicates whether this polyline is valid.
     * @remarks Valid polylines have at least one segment, no Invalid points and no zero length segments.
     * Closed polylines with only two segments are also not considered valid.
     */
    get IsValid(): boolean;
    /**
     * Gets the number of segments for this polyline.
     */
    get SegmentCount(): number;
    /**
     * Gets a value that indicates whether this polyline is closed.
     * @remarks The polyline is considered to be closed if its start is identical to its endpoint.
     * Polylines less than 3 points long are not considered closed.
     */
    get IsClosed(): boolean;
    /**
     * Gets the total length of the polyline.
     */
    get Length(): number;
    /**
     * Determines whether the polyline is closed, provided a tolerance value.
     * @param tolerance If the distance between the start and end point of the polyline is less than tolerance, the polyline is considered to be closed.
     * @returns true if the polyline is closed to within tolerance, false otherwise.
     */
    IsClosedWithinTolerance(tolerance: number): boolean;
    /**
     * Gets the point on the polyline at the given parameter.
     * @param t The integer part of the parameter indicates the index of the segment. like `1.4`
     * @returns Polyline parameter.
     */
    PointAt(t: number): Point3d;
    /**
     * Gets the line segment at the given index.
     * @param index Index of segment to retrieve, if it is not integer, it will be floored.
     * @returns Line segment at index or null on failure.
     */
    SegmentAt(index: number): Line | null;
    /**
     * Gets the unit tangent vector along the polyline at the given parameter.
     * The integer part of the parameter indicates the index of the segment.
     * @param t Polyline parameter.
     * @returns The tangent along the polyline at t.
     */
    TangentAt(t: number): Vector3d;
    /**
     * Constructs a polyline out of a parameter subdomain in this curve.
     * @param t0 The subdomain start of the polyline.
     * @param t1 The subdomain end of the polyline.
     * @remarks The integer part of the domain parameters indicate the index of the segment.
     * @returns The polyline as defined by the subdomain.
     */
    Trim(t0: number, t1: number): Polyline;
    /**
     * Gets the point on the polyline which is closest to a test-point.
     * @param testPoint Point to approximate.
     * @returns The point on the polyline closest to testPoint.
     */
    ClosestPoint(testPoint: Point3d): Point3d;
    /**
     * Gets the parameter along the polyline which is closest to a test-point.
     * @param testPoint Point to approximate.
     * @returns The parameter along the polyline closest to testPoint.
     */
    ClosestParameter(testPoint: Point3d): number;
    /**
     * Constructs an array of line segments that make up the entire polyline.
     * @returns An array of line segments or empty if the polyline contains fewer than 2 points.
     */
    GetSegments(): Line[];
    /**
     * Retuens a new polyline which removed all points that are closer than tolerance to the previous point.
     * @remarks Start and end points are left intact.
     * @param tolerance Vertices closer together than tolerance will be removed.
     * @returns The new polyline
     */
    DeleteShortSegments(tolerance?: number): Polyline;
    /**
     * Smoothens the polyline segments by averaging adjacent vertices.
     * Smoothing requires a polyline with exclusively valid vertices.
     * @param amount Amount to smooth. Zero equals no smoothing, one equals complete smoothing.
     */
    Smooth(amount: number): Polyline | null;
    /**
     * Check if the polyline is planar within the given tolerance.
     * @remarks The polyline must have at least 3 points. Or it is considered nonplanar.
     * @param tolerance
     * @returns true if the polyline is planar.
     */
    IsPlanar(tolerance?: number): boolean;
    /**
     * Try get the plane of the polyline if it is planar.
     * @param tolerance
     * @returns the plane or null if the polyline is not planar.
     */
    TryGetPlane(tolerance?: number): Plane | null;
    /**
     * Try get the area of the polyline if it is planar and closed.
     * @param tolerance
     * @returns the area or null if the polyline is not planar.
     */
    TryGetArea(tolerance?: number): number | null;
    /**
     * Checks if a point is on the polyline.
     * @param point the point to check.
     * @param tolerance
     * @returns true if the point is on the polyline.
     */
    IsPointOn(point: Point3d, tolerance?: number): boolean;
    /**
     * It checks if a point is inside a Closed Planar polyline.
     * @remarks The polyline must be closed and planar. If not, it throws an exception.
     * if the point is on the polyline, it returns false.
     * If the point is not on the polyline plane, it returns false.
     * It performs the even-odd-rule Algorithm (a raycasting algorithm)
     * see https://en.wikipedia.org/wiki/Point_in_polygon
     * @param point the point to check.
     * @param tolerance
     * @returns true if the point is inside the polyline.
     */
    IsPointInside(point: Point3d, tolerance?: number): boolean;
    /**
     * It assumes the polyline is planar on the XY plane and checks if a point is inside the polyline.
     * @param point
     */
    private IsPointInside2D;
    /**
     * Transform the polyline using a Transformation matrix.
     * @param transformation Transformation matrix to apply.
     * @returns A new transformed polyline.
     */
    Transform(transformation: Transform): Polyline;
    /**
     * Initializes a new polyline from a collection of points.
     * @returns A new polyline.
     */
    static CreateFromPoints(points: Point3d[]): Polyline;
    private static Smooth;
    /**
     * This assumes the polyline is planar on the XY plane.
     * @param points
     */
    private static SignedPolygonArea;
}

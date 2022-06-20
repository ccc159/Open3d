import { Point3d } from './Point3d';
import { Transform } from './Transform';
import { Vector3d } from './Vector3d';
/**
 * Represents the value of start and end points in a single line segment.
 */
export declare class Line {
    /**
     * Start point of line segment.
     */
    From: Point3d;
    /**
     * End point of line segment.
     */
    To: Point3d;
    /**
     * Constructs a new line segment between two points.
     * @param from the from point
     * @param to the to point
     */
    constructor(from: Point3d, to: Point3d);
    /**
     * Determines whether this line is valid.
     * A line is not valid when the start and end points are the same point.
     */
    get IsValid(): boolean;
    /**
     * Gets the direction of this line segment. The length of the direction vector equals the length of the line segment.
     */
    get Direction(): Vector3d;
    /**
     * Gets the direction of this line segment. The length of the direction vector is 1.
     */
    get UnitDirection(): Vector3d;
    /**
     * Gets the length of this line segment.
     */
    get Length(): number;
    /**
     * Sets the length of this line segment. Note that a negative length will invert the line segment without making the actual length negative. The line From point will remain fixed when a new Length is set.
     */
    set Length(l: number);
    /**
     * Make a copy of this line.
     */
    Clone(): Line;
    /**
     * Evaluates the line at the specified parameter.
     * @param param Parameter to evaluate line segment at. Line parameters are normalized parameters.
     * @returns The point at the specified parameter.
     */
    PointAt(param: number): Point3d;
    /**
     * Computes a point located at a specific metric distance from the line origin (From). If line start and end coincide, then the start point is always returned.
     * @param distance A positive, 0, or a negative value that will be the distance from From.
     * @returns The newly found point.
     */
    PointAtLength(distance: number): Point3d;
    /**
     * Finds the parameter on the (in)finite line segment that is closest to a test point.
     * @param testPoint Point to project onto the line.
     * @param limitToFiniteSegment If true, the projection is limited to the finite line segment. default: false
     * @returns The parameter on the line that is closest to testPoint.
     */
    ClosestParameter(testPoint: Point3d, limitToFiniteSegment?: boolean): number;
    /**
     * Finds the point on the (in)finite line segment that is closest to a test point.
     * @param testPoint Point to project onto the line.
     * @param limitToFiniteSegment If true, the projection is limited to the finite line segment. default: false
     * @returns The point on the (in)finite line that is closest to testPoint.
     */
    ClosestPoint(testPoint: Point3d, limitToFiniteSegment?: boolean): Point3d;
    /**
     * Compute the shortest distance between this line segment and a test point.
     * @param testPoint Point for distance computation.
     * @param limitToFiniteSegment If true, the distance is limited to the finite line segment. default: false
     * @returns The shortest distance between this line segment and testPoint.
     */
    DistanceTo(testPoint: Point3d, limitToFiniteSegment?: boolean): number;
    /**
     * Determines whether a line has the same value as this line.
     * @param other A line.
     * @returns true if other has the same coordinates as this; otherwise false.
     */
    Equals(other: Line): boolean;
    /**
     * Extend the line by custom distances on both sides.
     * @param startLength Distance to extend the line at the start point. Positive distance result in longer lines.
     * @param endLength Distance to extend the line at the end point. Positive distance result in longer lines.
     * @returns The extended line.
     */
    Extend(startLength: number, endLength: number): Line;
    /**
     * Flip the endpoints of the line and return a new line.
     * @returns A new flipped line.
     */
    Flip(): Line;
    /**
     * Transform the line using a Transformation matrix.
     * @param transformation Transformation matrix to apply.
     * @returns A new transformed line.
     */
    Transform(transformation: Transform): Line;
}

import { Transform } from './Transform';
import { Line } from './Line';
import { Vector3d } from './Vector3d';
import { Point3d } from './Point3d';
/**
 * Represents the value of a center point and two axes in a plane in three dimensions.
 */
export declare class Plane {
    /**
     * Origin point of this plane.
     */
    Origin: Point3d;
    /**
     * X axis vector of this plane.
     */
    readonly XAxis: Vector3d;
    /**
     * Y axis vector of this plane.
     */
    readonly YAxis: Vector3d;
    /**
     * Z axis vector of this plane.
     */
    readonly ZAxis: Vector3d;
    /**
     * Constructs a plane from a point and two vectors in the plane.
     * @param origin The origin point of the plane.
     * @param xAxis The X axis vector of the plane.
     * @param yAxis The Y axis vector of the plane.
     * @returns The plane created from the given point and vectors.
     */
    constructor(origin: Point3d, xAxis: Vector3d, yAxis: Vector3d);
    /**
     * Gets the normal of this plane. This is essentially the ZAxis of the plane.
     */
    get Normal(): Vector3d;
    /**
     * Gets x axis as a line
     */
    get XAxisLine(): Line;
    /**
     * Gets y axis as a line
     */
    get YAxisLine(): Line;
    /**
     * Gets z axis as a line
     */
    get ZAxisLine(): Line;
    /**
     * Gets plane equation in the form Ax + By + Cz + D = 0.
     */
    get Equation(): [number, number, number, number];
    /**
     * Gets XY plane where XAxis is world XAxis and YAxis is world YAxis.
     */
    static get PlaneXY(): Plane;
    /**
     * Gets ZX plane where XAxis is world ZAxis and YAxis is world XAxis.
     */
    static get PlaneZX(): Plane;
    /**
     * Gets YZ plane where XAxis is world YAxis and YAxis is world ZAxis.
     */
    static get PlaneYZ(): Plane;
    /**
     * Evaluate a point on the plane.
     * @param u The u parameter of the point on the plane.
     * @param v The v parameter of the point on the plane.
     * @returns The point at the specified parameter.
     */
    PointAt(u: number, v: number): Point3d;
    /**
     * Gets the parameters of the point on the plane closest to a test point.
     * @param point The point to test.
     * @returns The [u,v] parameters of the point on the plane closest to the test point.
     */
    ClosestParameter(testPoint: Point3d): [number, number];
    /**
     * Gets the point on the plane closest to a test point.
     * @param point Point to get close to..
     * @returns The point on the plane that is closest to testPoint.
     */
    ClosestPoint(testPoint: Point3d): Point3d;
    /**
     * Returns the signed distance from testPoint to its projection onto this plane. If the point is below the plane, a negative distance is returned.
     * @param testPoint The point to test.
     * @returns The signed distance
     */
    DistanceTo(testPoint: Point3d): number;
    /**
     * Make a copy of this plane by creating again from origin, XAxis and YAxis.
     */
    Clone(): Plane;
    /**
     * Flip this plane by swapping out the X and Y axes and inverting the Z axis.
     * @returns A new flipped plane.
     */
    Flip(): Plane;
    /**
     * Checks if a point is coplanar to this plane.
     * @param point The point to check.
     * @returns True if the point is coplanar to this plane.
     */
    IsPointCoplanar(point: Point3d): boolean;
    /**
     * Checks if a line is coplanar to this plane.
     * @param line The line to check.
     * @returns True if the line is coplanar to this plane.
     */
    IsLineCoplanar(line: Line): boolean;
    /**
     * Constructs a plane from a point and a normal vector.
     * @param origin The origin point of the plane.
     * @param normal The normal vector of the plane.
     * @returns The plane created from the given point and normal.
     */
    static CreateFromNormal(origin: Point3d, normal: Vector3d): Plane;
    /**
     * Constructs a plane from a point and two vectors in the plane.
     * @param origin The origin point of the plane.
     * @param xAxis The X axis vector of the plane.
     * @param yAxis The Y axis vector of the plane.
     * @returns The plane created from the given point and vectors.
     */
    static CreateFromFrame(origin: Point3d, xAxis: Vector3d, yAxis: Vector3d): Plane;
    /**
     * Transform the plane using a Transformation matrix.
     * @param transformation Transformation matrix to apply.
     * @returns A new transformed plane.
     */
    Transform(transformation: Transform): Plane;
}

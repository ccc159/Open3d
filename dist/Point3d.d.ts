import { Transform } from './Transform';
import { Vector3d } from './Vector3d';
/**
 * Represents the three coordinates of a point in three-dimensional space, using floating point values.
 */
export declare class Point3d {
    /**
     * Initializes a new point by defining the X, Y and Z coordinates.
     * @param x
     * @param y
     * @param z
     */
    constructor(x: number, y: number, z: number);
    /**
     * Initializes a new point by copying coordinates from the components of a vector.
     * @param vector A vector.
     */
    static CreateFromVector(vector: Vector3d): Point3d;
    /**
     * Initializes a new point by copying coordinates from another point.
     * @param point A point3d.
     */
    static CreateFromPoint3d(point: Point3d): Point3d;
    /**
     * Gets or sets the X (first) component of the point.
     */
    X: number;
    /**
     * Gets or sets the Y (second) component of the point.
     */
    Y: number;
    /**
     * Gets or sets the Z (third) component of the point.
     */
    Z: number;
    /**
     * Gets the value of a point at location 0,0,0.
     */
    static get Origin(): Point3d;
    /**
     * Sums up a point and a vector, and returns a new point.
     * @param point A point.
     * @param vecotr A vector.
     * @returns A new point that results from the addition of point and vector.
     */
    static Add(point: Point3d, vector: Vector3d): Point3d;
    /**
     * Sums up a point and a point, and returns a new vector.
     * @param point1 A point.
     * @param point2 Another point.
     * @returns A new point that results from the addition of point1 and point2.
     */
    static AddPoint(point1: Point3d, point2: Point3d): Point3d;
    /**
     * Sums up a point and a vector, and returns a new point.
     * @param vector A vector.
     * @returns A new point that results from the addition of point and vector.
     */
    Add(vecotr: Vector3d): Point3d;
    /**
     * Sums up a point and a point, and returns a new point.
     * @param point A point.
     * @returns A new point that results from the addition of point and point.
     */
    AddPoint(point: Point3d): Point3d;
    /**
     * Subtracts a vector from a point.
     * @param point A point.
     * @param vecotr A vector.
     * @returns A new point that is the difference of point minus vector.
     */
    static Subtract(point: Point3d, vector: Vector3d): Point3d;
    /**
     * Subtracts a point from a point.
     * @param point1 A point.
     * @param point2 A point.
     * @returns A new point that is the difference of point minus vector.
     */
    static SubtractPoint(point1: Point3d, point2: Point3d): Vector3d;
    /**
     * Subtracts a vector from a point.
     * @param vecotr A vector.
     * @returns A new point that is the difference of point minus vector.
     */
    Subtract(vecotr: Vector3d): Point3d;
    /**
     * Subtracts a point from a point.
     * @param point A point.
     * @returns A new point that is the difference of point minus vector.
     */
    SubtractPoint(point: Point3d): Vector3d;
    /**
     * Multiplies a Point3d by a number.
     * @param point A point.
     * @param t A number.
     * @returns A new point that is coordinate-wise multiplied by t.
     */
    static Multiply(point: Point3d, t: number): Point3d;
    /**
     * Multiplies a Point3d by a number.
     * @param factor the factor to multiply this point by.
     * @returns A new point that is coordinate-wise multiplied by t.
     */
    Multiply(factor: number): Point3d;
    /**
     * Divides a Point3d by a number.
     * @param point A point.
     * @param t A number.
     * @returns A new point that is coordinate-wise divided by t.
     */
    static Divide(point: Point3d, t: number): Point3d;
    /**
     * Divides a Point3d by a number.
     * @param factor the factor to divide this point by.
     * @returns A new point that is coordinate-wise divided by t.
     */
    Divide(factor: number): Point3d;
    /**
     * Interpolate between two points.
     * @param a First point.
     * @param b Second point.
     * @param t Interpolation parameter. If t=0 then this point is set to pA. If t=1 then this point is set to pB. Values of t in between 0.0 and 1.0 result in points between pA and pB.
     * @returns A new point that is the linear interpolation between a and b at t.
     */
    static Interpolate(v1: Point3d, v2: Point3d, t: number): Point3d;
    /**
     * Computes distance between two points.
     * @param a First point.
     * @param b Second point.
     */
    static Distance(a: Point3d, b: Point3d): number;
    /**
     * Computes distance to another point.
     * @param a First point.
     * @param b Second point.
     * @returns The length of the line between this and the other point; or 0 if any of the points is not valid.
     */
    DistanceTo(other: Point3d): number;
    /**
     * Determines whether two points have the same value.
     * @param a A point.
     * @param b A second point.
     * @returns true if point has the same coordinates as this; otherwise false.
     */
    static Equals(a: Point3d, b: Point3d): boolean;
    /**
     * Determines whether it equials to other point.
     * @param other Another point to compare.
     */
    Equals(other: Point3d): boolean;
    /**
     * Transforms the point and return a new point
     * The transformation matrix acts on the left of the point; i.e.,
     * result = transformation * point
     * @param transformation Transformation matrix to apply.
     */
    Transform(transformation: Transform): Point3d;
    /**
     * override toString
     */
    toString(): string;
}

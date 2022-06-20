import { Open3d } from './Open3d';
import { Point3d } from './Point3d';
import { Transform } from './Transform';
/**
 * Represents the 3d vector in three-dimensional space.
 */
export declare class Vector3d {
    /**
     * Initializes a new instance of a vector, using its three components.
     * @param x
     * @param y
     * @param z
     */
    constructor(x: number, y: number, z: number);
    /**
     *
  Initializes a new instance of a vector, copying the three components from a vector.
     * @param vector A vector.
     */
    static CreateFromVector(vector: Vector3d): Vector3d;
    /**
     * Initializes a new instance of a vector, copying the three components from the three coordinates of a point.
     * @param point A point3d.
     */
    static CreateFromPoint3d(point: Point3d): Vector3d;
    /**
     * Gets or sets the X (first) component of the vector.
     */
    X: number;
    /**
     * Gets or sets the Y (second) component of the vector.
     */
    Y: number;
    /**
     * Gets or sets the Z (third) component of the vector.
     */
    Z: number;
    /**
     * Gets a value indicating whether or not this is a unit vector. A unit vector has length 1.
     */
    get IsUnitVector(): boolean;
    /**
     * Gets a value indicating whether the X, Y, and Z values are all equal to 0.0.
     */
    get IsZero(): boolean;
    /**
     * Computes the length (or magnitude, or size) of this vector.
     */
    get Length(): number;
    /**
     * Gets the value of the vector with components 1,0,0.
     */
    static XAxis: Vector3d;
    /**
     * Gets the value of the vector with components 0,1,0.
     */
    static YAxis: Vector3d;
    /**
     * Gets the value of the vector with components 0,0,1.
     */
    static ZAxis: Vector3d;
    /**
     * Gets the value of the vector with components 0,0,0.
     */
    static Zero: Vector3d;
    /**
     * Sums up two vectors.
     * @param a A vector.
     * @param b A second vector.
     * @returns A sum vector.
     */
    static Add(a: Vector3d, b: Vector3d): Vector3d;
    /**
     * Sums up a vector to a point and returns a new point.
     * @param vector A vector.
     * @param point A point.
     * @returns The new point from the addition of vector and point.
     */
    static AddToPoint(vector: Vector3d, point: Point3d): Point3d;
    /**
     * Add a vector to this vector and returns a new vector.
     * @param vector A vector.
     * @returns A new vector that is the sum of this and vector.
     */
    Add(other: Vector3d): Vector3d;
    /**
     * Add a point to this vector and returns a new point.
     * @param point A point.
     * @returns A new point that is the sum of this and vector.
     */
    AddToPoint(other: Point3d): Point3d;
    /**
     * Subtracts the second vector from the first one.
     * @param a A vector.
     * @param b A second vector.
     * @returns A subtract vector.
     */
    static Subtract(a: Vector3d, b: Vector3d): Vector3d;
    /**
     * Subtract a vector from this vector and returns a new vector.
     * @param vector A vector
     * @returns A new vector
     */
    Subtract(other: Vector3d): Vector3d;
    /**
     * Multiplies a vector by a number, having the effect of scaling it.
     * @param vector A vector.
     * @param t A number.
     * @returns A new vector that is the original vector coordinatewise multiplied by t.
     */
    static Multiply(vector: Vector3d, t: number): Vector3d;
    /**
     * Multiplies this vector by a factor and returns a new vector.
     * @param factor the factor to multiply this vector by.
     * @returns A new vector
     */
    Multiply(factor: number): Vector3d;
    /**
     * Divides a Vector3d by a number, having the effect of shrinking it.
     * @param vector A vector.
     * @param t A number.
     * @returns A new vector that is componentwise divided by t.
     */
    static Divide(vector: Vector3d, t: number): Vector3d;
    /**
     * Divides this vector by a factor and returns a new vector.
     * @param factor the factor to divide this vector by.
     * @returns A new vector
     */
    Divide(factor: number): Vector3d;
    /**
     * Interpolate between two points/vectors.
     * @param a First point/vector.
     * @param b Second point/vector.
     * @param t A number in the range [0,1].
     * @returns A new vector that is the linear interpolation between a and b at t.
     */
    static Interpolate(v1: Vector3d, v2: Vector3d, t: number): Vector3d;
    /**
     * returning the dot product of two vectors
     * @param a A vector.
     * @param b A second vector.
     */
    static DotProduct(a: Vector3d, b: Vector3d): number;
    /**
     * dot product of this vector and other vector
     * @param other Another vector to dot product with.
     */
    DotProduct(other: Vector3d): number;
    /**
     * Computes the cross product (or vector product, or exterior product) of two vectors.
     * This operation is not commutative.
     * @param a First vector.
     * @param b Second vector.
     * @returns A new vector that is perpendicular to both a and b, has Length == a.Length * b.Length * sin(theta) where theta is the angle between a and b. The resulting vector is oriented according to the right hand rule.
     */
    static CrossProduct(a: Vector3d, b: Vector3d): Vector3d;
    /**
     * cross product of this vector and other vector
     * @param other Another vector to cross product with.
     */
    CrossProduct(other: Vector3d): Vector3d;
    /**
     * Computes distance between two points.
     * @param a First vector.
     * @param b Second vector.
     */
    static Distance(a: Vector3d, b: Vector3d): number;
    /**
     * Computes distance to another point.
     * @param a First vector.
     * @param b Second vector.
     */
    DistanceTo(other: Vector3d): number;
    /**
     * Determines whether two vectors have the same value.
     * @param a A vector.
     * @param b A second vector.
     * @returns true if vector has the same coordinates as this; otherwise false.
     */
    static Equals(a: Vector3d, b: Vector3d): boolean;
    /**
     * Determines whether it equials to other vector.
     * @param other Another vector to compare.
     */
    Equals(other: Vector3d): boolean;
    /**
     * Compute the angle between two vectors.
     * @param a First vector for angle.
     * @param b Second vector for angle.
     * @returns The angle between a and b in radians.
     */
    static VectorAngle(a: Vector3d, b: Vector3d): number;
    /**
     * Compute the angle between two vectors.
     * @param other Another vector to compare.
     * @returns The angle between this and other in radians.
     */
    VectorAngle(other: Vector3d): number;
    /**
     * Reverse a vector.
     */
    static Reverse(v: Vector3d): Vector3d;
    /**
     * return a reversed vector
     */
    Reverse(): Vector3d;
    /**
     * Unitize a vector.
     */
    static Unitize(v: Vector3d): Vector3d;
    /**
     * return a unitized vector
     */
    Unitize(): Vector3d;
    /**
     * Determines whether a vector is parallel to another vector
     * @param a First vector for angle.
     * @param b Second vector for angle.
     * @returns ParallelIndicator
     */
    static IsParallel(a: Vector3d, b: Vector3d): Open3d.ParallelIndicator;
    /**
     * Determines whether a vector is parallel to another vector
     * @param other Another vector to compare.
     */
    IsParallelTo(other: Vector3d): Open3d.ParallelIndicator;
    /**
     * Determines whether a vector is perpendicular to another vector
     * @param a First vector for angle.
     * @param b Second vector for angle.
     * @returns true if vectors form Pi-radians (90-degree) angles with each other; otherwise false.
     */
    static IsPerpendicular(a: Vector3d, b: Vector3d): boolean;
    /**
     * Determines whether a vector is perpendicular to another vector
     * @param other Another vector to compare.
     */
    IsPerpendicularTo(other: Vector3d): boolean;
    /**
     * Rotates this vector around a given axis.
     * @param angle Angle of rotation (in radians).
     * @param axis Axis of rotation.
     */
    VectorRotate(angle: number, axis: Vector3d): Vector3d;
    /**
     * Get an arbitrary vector perpendicular to this vector
     */
    GetPerpendicularVector(): Vector3d;
    /**
     * Transforms the vector and return a new vector
     * The transformation matrix acts on the left of the vector; i.e.,
     * result = transformation * vector
     * @param transformation Transformation matrix to apply.
     */
    Transform(transformation: Transform): Vector3d;
    /**
     * override toString
     */
    toString(): string;
}

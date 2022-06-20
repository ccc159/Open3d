import { Plane } from './Plane';
import { Point3d } from './Point3d';
import { Vector3d } from './Vector3d';
/**
 * a type that has an array of 16 numbers
 */
export declare type Array16Number = [number, number, number, number, number, number, number, number, number, number, number, number, number, number, number, number];
/**
 * Represents the values in a 4x4 transform matrix.
 */
export declare class Transform {
    private m;
    /**
     * Create a new matrix from an array of 16 values.
     * @param m Value to assign to the matrix using [n11, n21, n31, n41, n12, n22, n32, n42, n13, n23, n33, n43, n14, n24, n34, n44] format.
     */
    constructor(m: Array16Number);
    /**
     * The determinant of this 4x4 matrix.
     */
    get Determinant(): number;
    /**
     * Gets the transformation array.
     */
    get M(): Array16Number;
    /**
     * Gets a new identity transform matrix. An identity matrix defines no transformation.
     */
    static get Identity(): Transform;
    /**
     * Return true if this Transform is the identity transform
     */
    get IsIdentity(): boolean;
    /**
     * ZeroTransformation diagonal = (0,0,0,1)
     */
    static get ZeroTransformation(): Transform;
    /**
     * 	True if all values are 0, except for M33 which is 1.
     */
    get IsZeroTransformation(): boolean;
    /**
     * Determines if another transform equals this transform value.
     * @param other The transform to compare.
     */
    Equals(other: Transform): boolean;
    /**
     * Returns a copy of the transform.
     */
    Clone(): Transform;
    /**
     * Returns the transform as an array.
     */
    ToArray(): Array16Number;
    /**
     * Multiplies (combines) two transformations.
     * @param a The first transform.
     * @param b The second transform.
     * @returns The result of the multiplication.
     */
    static MultiplyMatrix(a: Transform, b: Transform): Transform;
    /**
     *   Multiplies (combines) two transformations.
     *  @param other The second transform.
     * @returns The result of the multiplication.
     */
    MultiplyMatrix(other: Transform): Transform;
    /**
     * Multiplies a transformation by a scalar.
     * @param a The transform.
     * @param s The scalar.
     * @returns The result of the multiplication.
     */
    static MultiplyScalar(a: Transform, s: number): Transform;
    /**
     *   Multiplies a transformation by a scalar.
     *  @param scalar The scalar.
     * @returns The result of the multiplication.
     */
    MultiplyScalar(scalar: number): Transform;
    /**
     * Constructs a new rotation transformation with specified angle and rotation axis.
     * @param angle Angle (in Radians) of the rotation.
     * @param rotationAxis The axis to ratate around, default Vector3D.ZAxis
     * @param rotationCenter The center of the rotation, default (0,0,0).
     */
    static Rotation(angle: number, rotationAxis?: Vector3d, rotationCenter?: Point3d): Transform;
    /**
     * Constructs a new rotation transformation with specified angle and rotation axis.
     * This function assume the rotation origin is the world origin.
     * @param angle Angle (in Radians) of the rotation.
     * @param axis The axis to ratate around
     */
    static RotateAtOrigin(angle: number, axis: Vector3d): Transform;
    /**
     * Constructs a new rotation transformation that rotates around X axis.
     * this is also called "roll"
     * @param angle Angle (in Radians) of the rotation.
     */
    static RotationX(angle: number): Transform;
    /**
     * Constructs a new rotation transformation that rotates around Y axis.
     * this is also called "pitch"
     * @param angle Angle (in Radians) of the rotation.
     */
    static RotationY(angle: number): Transform;
    /**
     * Constructs a new rotation transformation that rotates around Z axis.
     * this is also called "yaw"
     * @param angle Angle (in Radians) of the rotation.
     */
    static RotationZ(angle: number): Transform;
    /**
     * Create rotation transformation From ZYX angles.
     *
     * @param z Yaw: Angle in radians to rotate around Z axis.
     * @param y Pitch: Angle in radians to rotate around Y axis.
     * @param x Roll: Angle in radians to rotate around X axis.
     */
    static RotationZYX(z: number, y: number, x: number): Transform;
    /**
     * Constructs a new translation (move) transformation.
     * a translation matrix looks like
     * [ 1 0 0 tx]
     * [ 0 1 0 ty]
     * [ 0 0 1 tz]
     * [ 0 0 0  1]
     * @param v The vector to scale by
     * @returns The translated transform
     */
    static Translation(v: Vector3d): Transform;
    /**
     * Constructs a new uniform scaling transformation with a specified scaling anchor point.
     * @param location The location to scale from
     * @param scalar The scaling factor
     * @returns The scaled transform
     */
    static Scale(location: Point3d, scalar: number): Transform;
    /**
     * Constructs a new transform by combining given transforms in order
     * Note: as transforms multiplication is not commutative, the order matters.
     * If none given, identity transform is returned.
     * @param transforms The transforms array.
     * @returns The combined transform.
     */
    static CombineTransforms(transforms: Transform[]): Transform;
    /**
     * Constructs a new uniform scaling transformation.
     * a sacle matrix looks like
     * [ sx 0  0  0]
     * [ 0  sy 0  0]
     * [ 0  0  sz 0]
     * [ 0  0  0  1]
     * @param sx The scaling factor in the x dimension
     * @param sy The scaling factor in the y dimension
     * @param sz The scaling factor in the z dimension
     * @returns The scaled transform
     */
    static ScaleAtOrigin(sx: number, sy: number, sz: number): Transform;
    /**
     * Constructs a projection transformation.
     * @param plane Plane onto which everything will be perpendicularly projected.
     * @returns A transformation matrix which projects geometry onto a specified plane.
     */
    static PlanarProjection(plane: Plane): Transform;
    /**
     * Constructs a new Mirror transformation.
     * @param plane Plane that defines the mirror orientation and position.
     * @returns A transformation matrix which mirrors geometry in a specified plane.
     */
    static Mirror(plane: Plane): Transform;
    /**
     * Constructs a rotation transformation that rotates one vecor to another
     * @param fromVector the from vector
     * @param toVector the to vector
     * @returns A rotation matrix which rotates fromVector to toVector
     */
    static VectorToVector(fromVector: Vector3d, toVector: Vector3d): Transform;
    /**
     * Create a transformation that orients plane0 to plane1. If you want to orient objects from one plane to another, use this form of transformation.
     * @param fromPlane The plane to orient from.
     * @param toPlane the plane to orient to.
     * @returns A transformation matrix which orients from fromPlane to toPlane
     */
    static PlaneToPlane(fromPlane: Plane, toPlane: Plane): Transform;
    /**
     * Transpose the matrix and return a new one.
     */
    Transpose(): Transform;
    /**
     * Attempts to get the inverse transform of this transform.
     */
    TryGetInverse(): Transform | null;
    /**
     * override toString
     */
    toString(): string;
}

import { Open3d, ParallelIndicator } from './constants';
import { Transform } from './Transform';

/**
 * Represents the 3d vector in three-dimensional space.
 */
export class Vector3d {
  /**
   * Initializes a new instance of a vector, using its three components.
   * @param x
   * @param y
   * @param z
   */
  constructor(x: number, y: number, z: number) {
    this.X = x;
    this.Y = y;
    this.Z = z;
  }

  // #region Properties

  /**
   * Gets or sets the X (first) component of the vector.
   */
  public X: number;

  /**
   * Gets or sets the Y (second) component of the vector.
   */
  public Y: number;

  /**
   * Gets or sets the Z (third) component of the vector.
   */
  public Z: number;

  /**
   * Gets a value indicating whether or not this is a unit vector. A unit vector has length 1.
   */
  public get IsUnitVector(): boolean {
    return Open3d.equals(this.Length, 1.0);
  }

  /**
   * Gets a value indicating whether the X, Y, and Z values are all equal to 0.0.
   */
  public get IsZero(): boolean {
    return Open3d.equals(this.X, 0.0) && Open3d.equals(this.Y, 0.0) && Open3d.equals(this.Z, 0.0);
  }

  /**
   * Computes the length (or magnitude, or size) of this vector.
   */
  public get Length(): number {
    return Math.hypot(this.X, this.Y, this.Z);
  }

  /**
   * Gets the value of the vector with components 1,0,0.
   */
  public static XAxis: Vector3d = new Vector3d(1, 0, 0);

  /**
   * Gets the value of the vector with components 0,1,0.
   */
  public static YAxis: Vector3d = new Vector3d(0, 1, 0);

  /**
   * Gets the value of the vector with components 0,0,1.
   */
  public static ZAxis: Vector3d = new Vector3d(0, 0, 1);

  /**
   * Gets the value of the vector with components 0,0,0.
   */
  public static Zero: Vector3d = new Vector3d(0, 0, 0);

  // #endregion

  // #region Math functions

  /**
   * Sums up two vectors.
   * @param a A vector.
   * @param b A second vector.
   * @returns A sum vector.
   */
  public static Add(a: Vector3d, b: Vector3d): Vector3d {
    return new Vector3d(a.X + b.X, a.Y + b.Y, a.Z + b.Z);
  }

  /**
   * Subtracts the second vector from the first one.
   * @param a A vector.
   * @param b A second vector.
   * @returns A subtract vector.
   */
  public static Subtract(a: Vector3d, b: Vector3d): Vector3d {
    return new Vector3d(a.X - b.X, a.Y - b.Y, a.Z - b.Z);
  }

  /**
   * Multiplies a vector by a number, having the effect of scaling it.
   * @param vector A vector.
   * @param t A number.
   * @returns A new vector that is the original vector coordinatewise multiplied by t.
   */
  public static Multiply(vector: Vector3d, t: number): Vector3d {
    return new Vector3d(vector.X * t, vector.Y * t, vector.Z * t);
  }

  /**
   * Divides a Vector3d by a number, having the effect of shrinking it.
   * @param vector A vector.
   * @param t A number.
   * @returns A new vector that is componentwise divided by t.
   */
  public static Divide(vector: Vector3d, t: number): Vector3d {
    const one_over_d = 1.0 / t;
    return new Vector3d(vector.X * one_over_d, vector.Y * one_over_d, vector.Z * one_over_d);
  }

  /**
   * returning the dot product of two vectors
   * @param a A vector.
   * @param b A second vector.
   */
  public static DotProduct(a: Vector3d, b: Vector3d): number {
    return a.X * b.X + a.Y * b.Y + a.Z * b.Z;
  }

  /**
   * Computes the cross product (or vector product, or exterior product) of two vectors.
   * This operation is not commutative.
   * @param a First vector.
   * @param b Second vector.
   * @returns A new vector that is perpendicular to both a and b, has Length == a.Length * b.Length * sin(theta) where theta is the angle between a and b. The resulting vector is oriented according to the right hand rule.
   */
  public static CrossProduct(a: Vector3d, b: Vector3d): Vector3d {
    return new Vector3d(a.Y * b.Z - b.Y * a.Z, a.Z * b.X - b.Z * a.X, a.X * b.Y - b.X * a.Y);
  }

  /**
   * Determines whether two vectors have the same value.
   * @param a A vector.
   * @param b A second vector.
   * @returns true if vector has the same coordinates as this; otherwise false.
   */
  public static Equals(a: Vector3d, b: Vector3d): boolean {
    return Open3d.equals(a.X, b.X) && Open3d.equals(a.Y, b.Y) && Open3d.equals(a.Z, b.Z);
  }

  /**
   * Compute the angle between two vectors.
   * @param a First vector for angle.
   * @param b Second vector for angle.
   */
  public static VectorAngle(a: Vector3d, b: Vector3d): number {
    if (a.IsZero || b.IsZero) throw new Error('Cannot compute angle of zero-length vector.');
    return Math.acos(Vector3d.DotProduct(a, b) / (a.Length * b.Length));
  }

  /**
   * Reverse a vector.
   */
  public static Reverse(v: Vector3d) {
    return new Vector3d(-v.X, -v.Y, -v.Z);
  }

  /**
   * return a reversed vector
   */
  public Reverse() {
    return Vector3d.Reverse(this);
  }

  /**
   * Unitize a vector.
   */
  public static Unitize(v: Vector3d): Vector3d {
    var length = v.Length;
    if (length === 0) throw new Error('Cannot unitize a zero-length vector.');
    const unit = new Vector3d(v.X / length, v.Y / length, v.Z / length);
    return unit;
  }

  // #endregion

  /**
   * Determines whether a vector is parallel to another vector
   * @param a First vector for angle.
   * @param b Second vector for angle.
   * @returns ParallelIndicator
   */
  public static IsParallel(a: Vector3d, b: Vector3d): ParallelIndicator {
    if (a.IsZero || b.IsZero) return ParallelIndicator.Parallel;
    const angle = Vector3d.VectorAngle(a, b);
    if (Open3d.angleEquals(angle, 0)) return ParallelIndicator.Parallel;
    if (Open3d.angleEquals(angle, Math.PI)) return ParallelIndicator.AntiParallel;
    return ParallelIndicator.NotParallel;
  }

  /**
   * Determines whether a vector is perpendicular to another vector
   * @param a First vector for angle.
   * @param b Second vector for angle.
   * @returns true if vectors form Pi-radians (90-degree) angles with each other; otherwise false.
   */
  public IsPerpendicular(a: Vector3d, b: Vector3d): boolean {
    if (a.IsZero || b.IsZero) true;
    const angle = Vector3d.VectorAngle(a, b);
    if (Open3d.angleEquals(angle, Math.PI / 2)) return true;
    if (Open3d.angleEquals(angle, -Math.PI / 2)) return true;
    return false;
  }

  /**
   * Rotates this vector around a given axis.
   * @param angleRadians Angle of rotation (in radians).
   * @param rotationAxis Axis of rotation.
   */
  public Rotate(angleRadians: number, rotationAxis: Vector3d) {
    throw new Error('Not implemented');
  }

  /**
   * Transforms the vector and return a new vector
   * The transformation matrix acts on the left of the vector; i.e.,
   * result = transformation*vector
   * @param transformation Transformation matrix to apply.
   */
  public Transform(transformation: Transform): Vector3d {
    let xx, yy, zz;
    const m = transformation.M;
    xx = m[0] * this.X + m[1] * this.Y + m[2] * this.Z;
    yy = m[4] * this.X + m[5] * this.Y + m[6] * this.Z;
    zz = m[8] * this.X + m[9] * this.Y + m[10] * this.Z;
    return new Vector3d(xx, yy, zz);
  }
}

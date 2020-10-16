import { ParallelIndicator } from './constants';
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
    this.x = x;
    this.y = y;
    this.z = z;
  }

  /**
   * field x
   */
  private x: number;

  /**
   * field y
   */
  private y: number;

  /**
   * field z
   */
  private z: number;

  /**
   * calculate the length of the vector
   */
  private _length() {
    return Math.hypot(this.x, this.y, this.z);
  }

  /**
   * Computes the length (or magnitude, or size) of this vector.
   */
  public get Length(): number {
    return this._length();
  }

  /**
   * Gets or sets the X (first) component of the vector.
   */
  public get X(): number {
    return this.x;
  }

  /**
   * Gets or sets the Y (second) component of the vector.
   */
  public get Y(): number {
    return this.y;
  }

  /**
   * Gets or sets the Z (third) component of the vector.
   */
  public get Z(): number {
    return this.z;
  }

  /**
   * Gets the value of the vector with components 1,0,0.
   */
  public static XAxis: Vector3d;

  /**
   * Gets the value of the vector with components 0,1,0.
   */
  public static YAxis: Vector3d;

  /**
   * Gets the value of the vector with components 0,0,1.
   */
  public static ZAxis: Vector3d;

  /**
   * Sums up two vectors.
   * @param a A vector.
   * @param b A second vector.
   * @returns A sum vector.
   */
  public static Add(a: Vector3d, b: Vector3d): Vector3d {
    return new Vector3d(a.x + b.x, a.y + b.y, a.z + b.z);
  }

  /**
   * Computes the cross product (or vector product, or exterior product) of two vectors.
   * This operation is not commutative.
   * @param a First vector.
   * @param b Second vector.
   * @returns A new vector that is perpendicular to both a and b, has Length == a.Length * b.Length * sin(theta) where theta is the angle between a and b. The resulting vector is oriented according to the right hand rule.
   */
  public static CrossProduct(a: Vector3d, b: Vector3d): Vector3d {
    return new Vector3d(a.y * b.z - b.y * a.z, a.z * b.x - b.z * a.x, a.x * b.y - b.x * a.y);
  }

  /**
   * Divides a Vector3d by a number, having the effect of shrinking it.
   * @param vector A vector.
   * @param t A number.
   * @returns A new vector that is componentwise divided by t.
   */
  public static Divide(vector: Vector3d, t: number): Vector3d {
    const one_over_d = 1.0 / t;
    return new Vector3d(vector.x * one_over_d, vector.y * one_over_d, vector.z * one_over_d);
  }

  /**
   * returning the dot product of two vectors
   * @param a A vector.
   * @param b A second vector.
   */
  public static DotProduct(a: Vector3d, b: Vector3d): number {
    return a.x * b.x + a.y * b.y + a.z * b.z;
  }

  /**
   * Determines whether the specified vector has the same value as the present vector.
   * @param vector The specified vector.
   * @returns true if vector has the same coordinates as this; otherwise false.
   */
  public Equals(vector: Vector3d): boolean {
    return this.x === vector.x && this.y === vector.y && this.z === vector.z;
  }

  /**
   * Determines whether this vector is parallel to another vector, within a provided tolerance.
   * @param vector Vector to use for comparison.
   * @param angleTolerance Angle tolerance (in radians). Default Pi/180.
   * @returns ParallelIndicator
   */
  public IsParallelTo(vector: Vector3d, angleTolerance: number = Math.PI / 180): ParallelIndicator {
    let parallel: ParallelIndicator = ParallelIndicator.NotParallel;
    const ll = vector.Length * this.Length;
    if (ll === 0) return parallel;
    const cos_angle = (this.x * vector.x + this.y * vector.y + this.z * vector.z) / ll;
    const cos_tol = Math.cos(angleTolerance);
    if (cos_angle >= cos_tol) parallel = ParallelIndicator.Parallel;
    else if (cos_angle <= -cos_tol) parallel = ParallelIndicator.AntiParallel;
    return parallel;
  }

  /**
   * Determines whether this vector is perpendicular to another vector, within a provided angle tolerance.
   * @param vector Vector to use for comparison.
   * @param angleTolerance Angle tolerance (in radians). Default Pi/180.
   * @returns true if vectors form Pi-radians (90-degree) angles with each other; otherwise false.
   */
  public IsPerpendicularTo(vector: Vector3d, angleTolerance: number = Math.PI / 180): boolean {
    let rc = false;
    const ll = vector.Length * this.Length;
    if (ll === 0) return rc;
    if (Math.abs(this.x * vector.x + this.y * vector.y + this.z * vector.z) / ll < Math.sin(angleTolerance)) rc = true;
    return rc;
  }

  /**
   * Multiplies a vector by a number, having the effect of scaling it.
   * @param vector A vector.
   * @param t A number.
   * @returns A new vector that is the original vector coordinatewise multiplied by t.
   */
  public static Multiply(vector: Vector3d, t: number): Vector3d {
    return new Vector3d(vector.x * t, vector.y * t, vector.z * t);
  }

  /**
   * Reverses this vector and returns a new vector
   */
  public Reverse() {
    return new Vector3d(-this.x, -this.y, -this.z);
  }

  /**
   * Rotates this vector around a given axis.
   * @param angleRadians Angle of rotation (in radians).
   * @param rotationAxis Axis of rotation.
   */
  public Rotate(angleRadians: number, rotationAxis: Vector3d) {
    let rot = Transform.Rotation(angleRadians, rotationAxis);
    return this.Transform(rot);
  }

  /**
   * Subtract current vector with another vector and return a new vector.
   * @param other the other vector.
   */
  public Subtract(other: Vector3d) {
    return new Vector3d(this.x - other.x, this.y - other.y, this.z - other.z);
  }

  /**
   * Transforms the vector and return a new vector
   * The transformation matrix acts on the left of the vector; i.e.,
   * result = transformation*vector
   * @param transformation Transformation matrix to apply.
   */
  public Transform(transformation: Transform): Vector3d {
    let xx, yy, zz;
    xx = transformation.m[0] * this.x + transformation.m[1] * this.y + transformation.m[2] * this.z;
    yy = transformation.m[4] * this.x + transformation.m[5] * this.y + transformation.m[6] * this.z;
    zz = transformation.m[8] * this.x + transformation.m[9] * this.y + transformation.m[10] * this.z;
    return new Vector3d(xx, yy, zz);
  }

  /**
   * Unitizes the vector and returns a new vector, An invalid or zero length vector cannot be unitized.
   */
  public Unitize(): Vector3d {
    var length = this.Length;
    if (length === 0) return this;
    const unit = new Vector3d(this.x / length, this.y / length, this.z / length);
    return unit;
  }

  /**
   * Compute the angle between two vectors.
   * @param a First vector for angle.
   * @param b Second vector for angle.
   */
  public static VectorAngle(a: Vector3d, b: Vector3d): number {
    return Math.acos(Vector3d.DotProduct(a, b) / (a.Length * b.Length));
  }
}

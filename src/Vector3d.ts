import { ParallelIndicator } from './constants';
import { Point3d } from './Point3d';
import { NumberEqual, NumberZero } from './utils';

/**
 * Represents the 3d vector in three-dimensional space.
 */
export class Vector3d {
  // /**
  //  * Initializes a new instance of a vector, copying the three components from the three coordinates of a point.
  //  * @param point
  //  */
  // constructor(point: Point3d);

  // /**
  //  * Initializes a new instance of a vector, copying the three components from a vector.
  //  * @param vector
  //  */
  // constructor(vector: Vector3d);

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
   * Determines whether the specified vector has the same value as the present vector.
   * @param vector The specified vector.
   * @returns true if vector has the same coordinates as this; otherwise false.
   */
  public Equals(vector: Vector3d): boolean {
    return NumberEqual(this.x, vector.x) && NumberEqual(this.y, vector.y) && NumberEqual(this.z, vector.z);
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
    if (NumberZero(ll)) return parallel;
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
    if (NumberZero(ll)) return rc;
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
   * Subtract current vector with another vector and return a new vector.
   * @param other the other vector.
   */
  public Subtract(other: Vector3d) {
    return new Vector3d(this.x - other.x, this.y - other.y, this.z - other.z);
  }
}

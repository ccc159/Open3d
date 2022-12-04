import { Open3d } from './Open3d';
import { Open3dMath } from './Open3dMath';
import { Point3d } from './Point3d';
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

  /**
   * 	
Initializes a new instance of a vector, copying the three components from a vector.
   * @param vector A vector.
   */
  public static CreateFromVector(vector: Vector3d): Vector3d {
    return new Vector3d(vector.X, vector.Y, vector.Z);
  }

  /**
   * Initializes a new instance of a vector, copying the three components from the three coordinates of a point.
   * @param point A point3d.
   */
  public static CreateFromPoint3d(point: Point3d): Vector3d {
    return new Vector3d(point.X, point.Y, point.Z);
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
    return Open3dMath.EpsilonEquals(this.Length, 1.0);
  }

  /**
   * Gets a value indicating whether the X, Y, and Z values are all equal to 0.0.
   */
  public get IsZero(): boolean {
    return (
      Open3dMath.EpsilonEquals(this.X, 0.0) &&
      Open3dMath.EpsilonEquals(this.Y, 0.0) &&
      Open3dMath.EpsilonEquals(this.Z, 0.0)
    );
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
   * Sums up a vector to a point and returns a new point.
   * @param vector A vector.
   * @param point A point.
   * @returns The new point from the addition of vector and point.
   */
  public static AddToPoint(vector: Vector3d, point: Point3d): Point3d {
    return new Point3d(vector.X + point.X, vector.Y + point.Y, vector.Z + point.Z);
  }

  /**
   * Add a vector to this vector and returns a new vector.
   * @param vector A vector.
   * @returns A new vector that is the sum of this and vector.
   */
  public Add(other: Vector3d): Vector3d {
    return Vector3d.Add(this, other);
  }

  /**
   * Add a point to this vector and returns a new point.
   * @param point A point.
   * @returns A new point that is the sum of this and vector.
   */
  public AddToPoint(other: Point3d): Point3d {
    return Vector3d.AddToPoint(this, other);
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
   * Subtract a vector from this vector and returns a new vector.
   * @param vector A vector
   * @returns A new vector
   */
  public Subtract(other: Vector3d): Vector3d {
    return Vector3d.Subtract(this, other);
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
   * Multiplies this vector by a factor and returns a new vector.
   * @param factor the factor to multiply this vector by.
   * @returns A new vector
   */
  public Multiply(factor: number): Vector3d {
    return Vector3d.Multiply(this, factor);
  }

  /**
   * Divides a Vector3d by a number, having the effect of shrinking it.
   * @param vector A vector.
   * @param t A number.
   * @returns A new vector that is componentwise divided by t.
   */
  public static Divide(vector: Vector3d, t: number): Vector3d {
    if (t === 0) throw new Error('Division by zero');
    const one_over_d = 1.0 / t;
    return new Vector3d(vector.X * one_over_d, vector.Y * one_over_d, vector.Z * one_over_d);
  }

  /**
   * Divides this vector by a factor and returns a new vector.
   * @param factor the factor to divide this vector by.
   * @returns A new vector
   */
  public Divide(factor: number): Vector3d {
    return Vector3d.Divide(this, factor);
  }

  /**
   * Interpolate between two points/vectors.
   * @param a First point/vector.
   * @param b Second point/vector.
   * @param t A number in the range [0,1].
   * @returns A new vector that is the linear interpolation between a and b at t.
   */
  public static Interpolate(v1: Vector3d, v2: Vector3d, t: number): Vector3d {
    return new Vector3d(
      v1.X + (v2.X - v1.X) * t,
      v1.Y + (v2.Y - v1.Y) * t,
      v1.Z + (v2.Z - v1.Z) * t,
    );
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
   * dot product of this vector and other vector
   * @param other Another vector to dot product with.
   */
  public DotProduct(other: Vector3d): number {
    return Vector3d.DotProduct(this, other);
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
   * cross product of this vector and other vector
   * @param other Another vector to cross product with.
   */
  public CrossProduct(other: Vector3d): Vector3d {
    return Vector3d.CrossProduct(this, other);
  }

  /**
   * Computes distance between two points.
   * @param a First vector.
   * @param b Second vector.
   */
  public static Distance(a: Vector3d, b: Vector3d): number {
    return b.Subtract(a).Length;
  }

  /**
   * Computes distance to another point.
   * @param a First vector.
   * @param b Second vector.
   */
  public DistanceTo(other: Vector3d): number {
    return Vector3d.Distance(this, other);
  }

  /**
   * Determines whether two vectors have the same value.
   * @param a A vector.
   * @param b A second vector.
   * @returns true if vector has the same coordinates as this; otherwise false.
   */
  public static Equals(a: Vector3d, b: Vector3d): boolean {
    return (
      Open3dMath.EpsilonEquals(a.X, b.X) &&
      Open3dMath.EpsilonEquals(a.Y, b.Y) &&
      Open3dMath.EpsilonEquals(a.Z, b.Z)
    );
  }

  /**
   * Determines whether it equials to other vector.
   * @param other Another vector to compare.
   */
  public Equals(other: Vector3d): boolean {
    return Vector3d.Equals(this, other);
  }

  /**
   * Compute the angle between two vectors.
   * @param a First vector for angle.
   * @param b Second vector for angle.
   * @returns The angle between a and b in radians.
   */
  public static VectorAngle(a: Vector3d, b: Vector3d): number {
    if (a.IsZero || b.IsZero) throw new Error('Cannot compute angle of zero-length vector.');
    let cos = Vector3d.DotProduct(a, b) / (a.Length * b.Length);
    cos = Open3dMath.Clamp(cos, -1, 1);
    return Math.acos(cos);
  }

  /**
   * Compute the angle between two vectors.
   * @param other Another vector to compare.
   * @returns The angle between this and other in radians.
   */
  public VectorAngle(other: Vector3d): number {
    return Vector3d.VectorAngle(this, other);
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
    const length = v.Length;
    if (length === 0) throw new Error('Cannot unitize a zero-length vector.');
    const unit = new Vector3d(v.X / length, v.Y / length, v.Z / length);
    return unit;
  }

  /**
   * return a unitized vector
   */
  public Unitize() {
    return Vector3d.Unitize(this);
  }

  // #endregion

  /**
   * Determines whether a vector is parallel to another vector
   * @param a First vector for angle.
   * @param b Second vector for angle.
   * @returns ParallelIndicator
   */
  public static IsParallel(a: Vector3d, b: Vector3d): Open3d.ParallelIndicator {
    if (a.IsZero || b.IsZero) return Open3d.ParallelIndicator.Parallel;
    const angle = Vector3d.VectorAngle(a, b);
    if (Open3dMath.EpsilonEquals(angle, 0, Open3d.ANGLE_EPSILON))
      return Open3d.ParallelIndicator.Parallel;
    if (Open3dMath.EpsilonEquals(angle, Math.PI, Open3d.ANGLE_EPSILON))
      return Open3d.ParallelIndicator.AntiParallel;
    return Open3d.ParallelIndicator.NotParallel;
  }

  /**
   * Determines whether a vector is parallel to another vector
   * @param other Another vector to compare.
   */
  public IsParallelTo(other: Vector3d): Open3d.ParallelIndicator {
    return Vector3d.IsParallel(this, other);
  }

  /**
   * Determines whether a vector is perpendicular to another vector
   * @param a First vector for angle.
   * @param b Second vector for angle.
   * @returns true if vectors form Pi-radians (90-degree) angles with each other; otherwise false.
   */
  public static IsPerpendicular(a: Vector3d, b: Vector3d): boolean {
    if (a.IsZero || b.IsZero) return true;
    const angle = Vector3d.VectorAngle(a, b);
    if (Open3dMath.EpsilonEquals(angle, Math.PI / 2, Open3d.ANGLE_EPSILON)) return true;
    if (Open3dMath.EpsilonEquals(angle, -Math.PI / 2, Open3d.ANGLE_EPSILON)) return true;
    return false;
  }

  /**
   * Determines whether a vector is perpendicular to another vector
   * @param other Another vector to compare.
   */
  public IsPerpendicularTo(other: Vector3d): boolean {
    return Vector3d.IsPerpendicular(this, other);
  }

  /**
   * Rotates this vector around a given axis.
   * @param angle Angle of rotation (in radians).
   * @param axis Axis of rotation.
   */
  public VectorRotate(angle: number, axis: Vector3d) {
    const rotation = Transform.RotateAtOrigin(angle, axis);
    return this.Transform(rotation);
  }

  /**
   * Get an arbitrary vector perpendicular to this vector
   */
  public GetPerpendicularVector(): Vector3d {
    // see https://github.com/mcneel/opennurbs/blob/7.x/opennurbs_point.cpp#L1107
    let i: number, j: number, k: number;
    let a: number, b: number;
    k = 2;
    if (Math.abs(this.Y) > Math.abs(this.X)) {
      if (Math.abs(this.Z) > Math.abs(this.Y)) {
        // |this.Z| > |this.Y| > |this.X|
        i = 2;
        j = 1;
        k = 0;
        a = this.Z;
        b = -this.Y;
      } else if (Math.abs(this.Z) >= Math.abs(this.X)) {
        // |this.Y| >= |this.Z| >= |this.X|
        i = 1;
        j = 2;
        k = 0;
        a = this.Y;
        b = -this.Z;
      } else {
        // |this.Y| > |this.X| > |this.Z|
        i = 1;
        j = 0;
        k = 2;
        a = this.Y;
        b = -this.X;
      }
    } else if (Math.abs(this.Z) > Math.abs(this.X)) {
      // |this.Z| > |this.X| >= |this.Y|
      i = 2;
      j = 0;
      k = 1;
      a = this.Z;
      b = -this.X;
    } else if (Math.abs(this.Z) > Math.abs(this.Y)) {
      // |this.X| >= |this.Z| > |this.Y|
      i = 0;
      j = 2;
      k = 1;
      a = this.X;
      b = -this.Z;
    } else {
      // |this.X| >= |this.Y| >= |this.Z|
      i = 0;
      j = 1;
      k = 2;
      a = this.X;
      b = -this.Y;
    }
    const arr = [0, 0, 0];
    arr[i] = b;
    arr[j] = a;
    arr[k] = 0.0;
    return new Vector3d(arr[0], arr[1], arr[2]).Unitize();
  }

  /**
   * Transforms the vector and return a new vector
   * The transformation matrix acts on the left of the vector; i.e.,
   * result = transformation * vector
   * @param transformation Transformation matrix to apply.
   */
  public Transform(transformation: Transform): Vector3d {
    const m = transformation.M;

    m[3] = 0;
    m[7] = 0;
    m[11] = 0;

    const xx = m[0] * this.X + m[1] * this.Y + m[2] * this.Z + m[3];
    const yy = m[4] * this.X + m[5] * this.Y + m[6] * this.Z + m[7];
    const zz = m[8] * this.X + m[9] * this.Y + m[10] * this.Z + m[11];
    return new Vector3d(xx, yy, zz);
  }

  /**
   * override toString
   */
  public toString(): string {
    return `Vector3d [${this.X}, ${this.Y}, ${this.Z}]`;
  }
}

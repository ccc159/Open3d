import { Open3d } from './Open3d';
import { Open3dMath } from './Open3dMath';
import { Transform } from './Transform';
import { Vector3d } from './Vector3d';

/**
 * Represents the three coordinates of a point in three-dimensional space, using floating point values.
 */
export class Point3d {
  /**
   * Initializes a new point by defining the X, Y and Z coordinates.
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
   * Initializes a new point by copying coordinates from the components of a vector.
   * @param vector A vector.
   */
  public static CreateFromVector(vector: Vector3d): Point3d {
    return new Point3d(vector.X, vector.Y, vector.Z);
  }

  /**
   * Initializes a new point by copying coordinates from another point.
   * @param point A point3d.
   */
  public static CreateFromPoint3d(point: Point3d): Point3d {
    return new Point3d(point.X, point.Y, point.Z);
  }

  // #region Properties

  /**
   * Gets or sets the X (first) component of the point.
   */
  public X: number;

  /**
   * Gets or sets the Y (second) component of the point.
   */
  public Y: number;

  /**
   * Gets or sets the Z (third) component of the point.
   */
  public Z: number;

  /**
   * Gets the value of a point at location 0,0,0.
   */
  public static get Origin(): Point3d {
    return new Point3d(0, 0, 0);
  }

  // #endregion

  // #region Math functions

  /**
   * Sums up a point and a vector, and returns a new point.
   * @param point A point.
   * @param vecotr A vector.
   * @returns A new point that results from the addition of point and vector.
   */
  public static Add(point: Point3d, vector: Vector3d): Point3d {
    return new Point3d(point.X + vector.X, point.Y + vector.Y, point.Z + vector.Z);
  }

  /**
   * Sums up a point and a point, and returns a new vector.
   * @param point1 A point.
   * @param point2 Another point.
   * @returns A new point that results from the addition of point1 and point2.
   */
  public static AddPoint(point1: Point3d, point2: Point3d): Point3d {
    return new Point3d(point1.X + point2.X, point1.Y + point2.Y, point1.Z + point2.Z);
  }

  /**
   * Sums up a point and a vector, and returns a new point.
   * @param vector A vector.
   * @returns A new point that results from the addition of point and vector.
   */
  public Add(vecotr: Vector3d): Point3d {
    return Point3d.Add(this, vecotr);
  }

  /**
   * Sums up a point and a point, and returns a new point.
   * @param point A point.
   * @returns A new point that results from the addition of point and point.
   */
  public AddPoint(point: Point3d): Point3d {
    return Point3d.AddPoint(this, point);
  }

  /**
   * Subtracts a vector from a point.
   * @param point A point.
   * @param vecotr A vector.
   * @returns A new point that is the difference of point minus vector.
   */
  public static Subtract(point: Point3d, vector: Vector3d): Point3d {
    return new Point3d(point.X - vector.X, point.Y - vector.Y, point.Z - vector.Z);
  }

  /**
   * Subtracts a point from a point.
   * @param point1 A point.
   * @param point2 A point.
   * @returns A new point that is the difference of point minus vector.
   */
  public static SubtractPoint(point1: Point3d, point2: Point3d): Vector3d {
    return new Vector3d(point1.X - point2.X, point1.Y - point2.Y, point1.Z - point2.Z);
  }

  /**
   * Subtracts a vector from a point.
   * @param vecotr A vector.
   * @returns A new point that is the difference of point minus vector.
   */
  public Subtract(vecotr: Vector3d): Point3d {
    return Point3d.Subtract(this, vecotr);
  }

  /**
   * Subtracts a point from a point.
   * @param point A point.
   * @returns A new point that is the difference of point minus vector.
   */
  public SubtractPoint(point: Point3d): Vector3d {
    return Point3d.SubtractPoint(this, point);
  }

  /**
   * Multiplies a Point3d by a number.
   * @param point A point.
   * @param t A number.
   * @returns A new point that is coordinate-wise multiplied by t.
   */
  public static Multiply(point: Point3d, t: number): Point3d {
    return new Point3d(point.X * t, point.Y * t, point.Z * t);
  }

  /**
   * Multiplies a Point3d by a number.
   * @param factor the factor to multiply this point by.
   * @returns A new point that is coordinate-wise multiplied by t.
   */
  public Multiply(factor: number): Point3d {
    return Point3d.Multiply(this, factor);
  }

  /**
   * Divides a Point3d by a number.
   * @param point A point.
   * @param t A number.
   * @returns A new point that is coordinate-wise divided by t.
   */
  public static Divide(point: Point3d, t: number): Point3d {
    if (t === 0) throw new Error('Division by zero');
    const one_over_d = 1.0 / t;
    return new Point3d(point.X * one_over_d, point.Y * one_over_d, point.Z * one_over_d);
  }

  /**
   * Divides a Point3d by a number.
   * @param factor the factor to divide this point by.
   * @returns A new point that is coordinate-wise divided by t.
   */
  public Divide(factor: number): Point3d {
    return Point3d.Divide(this, factor);
  }

  /**
   * Interpolate between two points.
   * @param a First point.
   * @param b Second point.
   * @param t Interpolation parameter. If t=0 then this point is set to pA. If t=1 then this point is set to pB. Values of t in between 0.0 and 1.0 result in points between pA and pB.
   * @returns A new point that is the linear interpolation between a and b at t.
   */
  public static Interpolate(v1: Point3d, v2: Point3d, t: number): Point3d {
    return new Point3d(v1.X + (v2.X - v1.X) * t, v1.Y + (v2.Y - v1.Y) * t, v1.Z + (v2.Z - v1.Z) * t);
  }

  /**
   * Computes distance between two points.
   * @param a First point.
   * @param b Second point.
   */
  public static Distance(a: Point3d, b: Point3d): number {
    return Math.hypot(a.X - b.X, a.Y - b.Y, a.Z - b.Z);
  }

  /**
   * Computes distance to another point.
   * @param a First point.
   * @param b Second point.
   * @returns The length of the line between this and the other point; or 0 if any of the points is not valid.
   */
  public DistanceTo(other: Point3d): number {
    return Point3d.Distance(this, other);
  }

  /**
   * Determines whether two points have the same value.
   * @param a A point.
   * @param b A second point.
   * @returns true if point has the same coordinates as this; otherwise false.
   */
  public static Equals(a: Point3d, b: Point3d): boolean {
    return Open3dMath.EpsilonEquals(a.X, b.X) && Open3dMath.EpsilonEquals(a.Y, b.Y) && Open3dMath.EpsilonEquals(a.Z, b.Z);
  }

  /**
   * Determines whether it equials to other point.
   * @param other Another point to compare.
   */
  public Equals(other: Point3d): boolean {
    return Point3d.Equals(this, other);
  }

  /**
   * Transforms the point and return a new point
   * The transformation matrix acts on the left of the point; i.e.,
   * result = transformation * point
   * @param transformation Transformation matrix to apply.
   */
  public Transform(transformation: Transform): Point3d {
    let xx, yy, zz;
    const m = transformation.M;

    xx = m[0] * this.X + m[1] * this.Y + m[2] * this.Z + m[3];
    yy = m[4] * this.X + m[5] * this.Y + m[6] * this.Z + m[7];
    zz = m[8] * this.X + m[9] * this.Y + m[10] * this.Z + m[11];
    return new Point3d(xx, yy, zz);
  }

  /**
   * Clone this point
   * @returns A new point that is a copy of this point.
   */
  public Clone(): Point3d {
    return new Point3d(this.X, this.Y, this.Z);
  }

  /**
   * override toString
   */
  public toString(): string {
    return `Point3d [${this.X}, ${this.Y}, ${this.Z}]`;
  }
}

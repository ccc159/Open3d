import { Line } from './Line';
import { Vector3d } from './Vector3d';

/**
 * Represents the value of a center point and two axes in a plane in three dimensions.
 */
export class Plane {
  /**
   * Origin point of this plane.
   */
  public Origin: Vector3d;

  /**
   * X axis vector of this plane.
   */
  public readonly XAxis: Vector3d;

  /**
   * Y axis vector of this plane.
   */
  public readonly YAxis: Vector3d;

  /**
   * Z axis vector of this plane.
   */
  public readonly ZAxis: Vector3d;

  /**
   * Constructs a plane from a point and two vectors in the plane.
   * @param origin The origin point of the plane.
   * @param xAxis The X axis vector of the plane.
   * @param yAxis The Y axis vector of the plane.
   * @returns The plane created from the given point and vectors.
   */
  public constructor(origin: Vector3d, xAxis: Vector3d, yAxis: Vector3d) {
    xAxis = xAxis.Unitize();
    yAxis = yAxis.Unitize();
    this.Origin = origin;
    this.XAxis = xAxis;
    this.YAxis = yAxis;
    this.ZAxis = xAxis.CrossProduct(yAxis).Unitize();
  }

  // #region Properties
  /**
   * Gets the normal of this plane. This is essentially the ZAxis of the plane.
   */
  public get Normal(): Vector3d {
    return this.XAxis;
  }

  /**
   * Gets x axis as a line
   */
  public get XAxisLine(): Line {
    return new Line(this.Origin, this.Origin.Add(this.XAxis));
  }

  /**
   * Gets y axis as a line
   */
  public get YAxisLine(): Line {
    return new Line(this.Origin, this.Origin.Add(this.YAxis));
  }

  /**
   * Gets z axis as a line
   */
  public get ZAxisLine(): Line {
    return new Line(this.Origin, this.Origin.Add(this.ZAxis));
  }

  // #endregion

  // #region Methods

  /**
   * Evaluate a point on the plane.
   * @param u The u parameter of the point on the plane.
   * @param v The v parameter of the point on the plane.
   * @returns The point at the specified parameter.
   */
  public PointAt(u: number, v: number): Vector3d {
    return this.Origin.Add(this.XAxis.Multiply(u)).Add(this.YAxis.Multiply(v));
  }

  /**
   * Gets the parameters of the point on the plane closest to a test point.
   * @param point The point to test.
   * @returns The [u,v] parameters of the point on the plane closest to the test point.
   */
  public ClosestParameter(testPoint: Vector3d): [number, number] {
    const u = this.XAxisLine.ClosestParameter(testPoint);
    const v = this.YAxisLine.ClosestParameter(testPoint);
    return [u, v];
  }

  /**
   * Gets the point on the plane closest to a test point.
   * @param point Point to get close to..
   * @returns The point on the plane that is closest to testPoint.
   */
  public ClosestPoint(testPoint: Vector3d): Vector3d {
    return this.PointAt(...this.ClosestParameter(testPoint));
  }

  /**
   * Returns the signed distance from testPoint to its projection onto this plane. If the point is below the plane, a negative distance is returned.
   * @param testPoint The point to test.
   * @returns The signed distance
   */
  public DistanceTo(testPoint: Vector3d): number {
    const vec = testPoint.Subtract(this.Origin);
    const distance = testPoint.DistanceTo(this.ClosestPoint(testPoint));
    return vec.DotProduct(this.ZAxis) > 0 ? distance : -distance;
  }

  /**
   * Make a copy of this plane.
   */
  public Clone(): Plane {
    return new Plane(this.Origin, this.XAxis, this.YAxis);
  }

  /**
   * Flip this plane by swapping out the X and Y axes and inverting the Z axis.
   * @returns A new flipped plane.
   */
  public Flip(): Plane {
    return new Plane(this.Origin, this.YAxis, this.XAxis);
  }

  /**
   * Checks if a point is coplanar to this plane.
   * @param point The point to check.
   * @returns True if the point is coplanar to this plane.
   */
  public IsPointCoplanar(point: Vector3d): boolean {
    return this.ClosestPoint(point).Equals(point);
  }

  /**
   * Checks if a line is coplanar to this plane.
   * @param line The line to check.
   * @returns True if the line is coplanar to this plane.
   */
  public IsLineCoplanar(line: Line): boolean {
    return this.ClosestPoint(line.From).Equals(line.From) && this.ClosestPoint(line.To).Equals(line.To);
  }

  /**
   * Intersect plane with a line.
   * @param line The line to intersect with.
   * @returns The intersection point.
   */
  public IntersectWithLine(line: Line): Vector3d {
    const diff = line.From.Subtract(this.Origin);
    const prod1 = diff.DotProduct(this.Normal);
    const prod2 = line.UnitDirection.DotProduct(this.Normal);
    const prod3 = prod1 / prod2;
    return line.From.Subtract(line.UnitDirection.Multiply(prod3));
  }

  /**
   * Constructs a plane from a point and a normal vector.
   * @param origin The origin point of the plane.
   * @param normal The normal vector of the plane.
   * @returns The plane created from the given point and normal.
   */
  public static CreateFromNormal(origin: Vector3d, normal: Vector3d): Plane {
    const zAxis = normal.Unitize();
    const xAxis = normal._perpendicularVector();
    const yAxis = xAxis.CrossProduct(zAxis).Unitize();

    return new Plane(origin, xAxis, yAxis);
  }

  /**
   * Constructs a plane from a point and two vectors in the plane.
   * @param origin The origin point of the plane.
   * @param xAxis The X axis vector of the plane.
   * @param yAxis The Y axis vector of the plane.
   * @returns The plane created from the given point and vectors.
   */
  public static CreateFromFrame(origin: Vector3d, xAxis: Vector3d, yAxis: Vector3d): Plane {
    return new Plane(origin, xAxis, yAxis);
  }

  // #endregion
}
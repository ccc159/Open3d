import { Transform } from "./Transform";
import { Line } from "./Line";
import { Vector3d } from "./Vector3d";
import { Point3d } from "./Point3d";

/**
 * Represents the value of a center point and two axes in a plane in three dimensions.
 */
export class Plane {
  /**
   * Origin point of this plane.
   */
  public Origin: Point3d;

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
  public constructor(origin: Point3d, xAxis: Vector3d, yAxis: Vector3d) {
    xAxis = xAxis.Unitize();
    yAxis = yAxis.Unitize();
    const zAxis = xAxis.CrossProduct(yAxis).Unitize();
    yAxis = zAxis.CrossProduct(xAxis).Unitize();
    this.Origin = origin;
    this.XAxis = xAxis;
    this.YAxis = yAxis;
    this.ZAxis = zAxis;
  }

  // #region Properties
  /**
   * Gets the normal of this plane. This is essentially the ZAxis of the plane.
   */
  public get Normal(): Vector3d {
    return this.ZAxis.Unitize();
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

  /**
   * Gets plane equation in the form Ax + By + Cz + D = 0.
   */
  public get Equation(): [number, number, number, number] {
    const { X, Y, Z } = this.Normal;
    return [
      X,
      Y,
      Z,
      -X * this.Origin.X - Y * this.Origin.Y - Z * this.Origin.Z,
    ];
  }

  /**
   * Gets XY plane where XAxis is world XAxis and YAxis is world YAxis.
   */
  public static get PlaneXY(): Plane {
    return new Plane(Point3d.Origin, Vector3d.XAxis, Vector3d.YAxis);
  }

  /**
   * Gets ZX plane where XAxis is world ZAxis and YAxis is world XAxis.
   */
  public static get PlaneZX(): Plane {
    return new Plane(Point3d.Origin, Vector3d.ZAxis, Vector3d.XAxis);
  }

  /**
   * Gets YZ plane where XAxis is world YAxis and YAxis is world ZAxis.
   */
  public static get PlaneYZ(): Plane {
    return new Plane(Point3d.Origin, Vector3d.YAxis, Vector3d.ZAxis);
  }

  // #endregion

  // #region Methods

  /**
   * Evaluate a point on the plane.
   * @param u The u parameter of the point on the plane.
   * @param v The v parameter of the point on the plane.
   * @returns The point at the specified parameter.
   */
  public PointAt(u: number, v: number): Point3d {
    return this.Origin.Add(this.XAxis.Multiply(u)).Add(this.YAxis.Multiply(v));
  }

  /**
   * Gets the parameters of the point on the plane closest to a test point.
   * @param point The point to test.
   * @returns The [u,v] parameters of the point on the plane closest to the test point.
   */
  public ClosestParameter(testPoint: Point3d): [number, number] {
    const u = this.XAxisLine.ClosestParameter(testPoint);
    const v = this.YAxisLine.ClosestParameter(testPoint);
    return [u, v];
  }

  /**
   * Gets the point on the plane closest to a test point.
   * @param point Point to get close to..
   * @returns The point on the plane that is closest to testPoint.
   */
  public ClosestPoint(testPoint: Point3d): Point3d {
    return this.PointAt(...this.ClosestParameter(testPoint));
  }

  /**
   * Returns the signed distance from testPoint to its projection onto this plane. If the point is below the plane, a negative distance is returned.
   * @param testPoint The point to test.
   * @returns The signed distance
   */
  public DistanceTo(testPoint: Point3d): number {
    const vec = testPoint.SubtractPoint(this.Origin);
    const distance = testPoint.DistanceTo(this.ClosestPoint(testPoint));
    return vec.DotProduct(this.ZAxis) > 0 ? distance : -distance;
  }

  /**
   * Make a copy of this plane by creating again from origin, XAxis and YAxis.
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
  public IsPointCoplanar(point: Point3d): boolean {
    return this.ClosestPoint(point).Equals(point);
  }

  /**
   * Checks if a line is coplanar to this plane.
   * @param line The line to check.
   * @returns True if the line is coplanar to this plane.
   */
  public IsLineCoplanar(line: Line): boolean {
    return (
      this.ClosestPoint(line.From).Equals(line.From) &&
      this.ClosestPoint(line.To).Equals(line.To)
    );
  }

  /**
   * Constructs a plane from a point and a normal vector.
   * @param origin The origin point of the plane.
   * @param normal The normal vector of the plane.
   * @returns The plane created from the given point and normal.
   */
  public static CreateFromNormal(origin: Point3d, normal: Vector3d): Plane {
    const zAxis = normal.Unitize();
    const xAxis = normal.GetPerpendicularVector();
    const yAxis = zAxis.CrossProduct(xAxis).Unitize();

    return new Plane(origin, xAxis, yAxis);
  }

  /**
   * Constructs a plane from a point and two vectors in the plane.
   * @param origin The origin point of the plane.
   * @param xAxis The X axis vector of the plane.
   * @param yAxis The Y axis vector of the plane.
   * @returns The plane created from the given point and vectors.
   */
  public static CreateFromFrame(
    origin: Point3d,
    xAxis: Vector3d,
    yAxis: Vector3d
  ): Plane {
    return new Plane(origin, xAxis, yAxis);
  }

  /**
   * Transform the plane using a Transformation matrix.
   * @param transformation Transformation matrix to apply.
   * @returns A new transformed plane.
   */
  public Transform(transformation: Transform): Plane {
    const origin = this.Origin.Transform(transformation);
    const xAxis = this.XAxis.Transform(transformation);
    const yAxis = this.YAxis.Transform(transformation);

    return new Plane(origin, xAxis, yAxis);
  }

  // #endregion
}

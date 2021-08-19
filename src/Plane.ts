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
  public XAxis: Vector3d;

  /**
   * Y axis vector of this plane.
   */
  public YAxis: Vector3d;

  /**
   * Z axis vector of this plane.
   */
  public ZAxis: Vector3d;

  /**
   * Create a plane from origin and x and y axis vectors.
   */
  private constructor(origin: Vector3d, xAxis: Vector3d, yAxis: Vector3d) {
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
    xAxis = xAxis.Unitize();
    yAxis = yAxis.Unitize();
    return new Plane(origin, xAxis, yAxis);
  }
  // #endregion
}

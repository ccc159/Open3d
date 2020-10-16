export class Point3d {
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
   * Gets or sets the X (first) component of the point.
   */
  public get X(): number {
    return this.x;
  }

  /**
   * Gets or sets the Y (second) component of the point.
   */
  public get Y(): number {
    return this.y;
  }

  /**
   * Gets or sets the Z (third) component of the point.
   */
  public get Z(): number {
    return this.z;
  }
}

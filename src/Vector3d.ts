import { Point3d } from './Point3d';

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
   * Sums up two vectors.
   * @param other the other vector.
   */
  public Add(other: Vector3d) {
    return new Vector3d(this.x + other.x, this.y + other.y, this.z + other.z);
  }
}

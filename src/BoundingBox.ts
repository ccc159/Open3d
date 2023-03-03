import { Open3d } from './Open3d';
import { Transform } from './Transform';
import { Vector3d } from './Vector3d';

/**
 * a type that has an array of 8 points
 */
export type Array8Points = [Vector3d, Vector3d, Vector3d, Vector3d, Vector3d, Vector3d, Vector3d, Vector3d];

/**
 * Represents the value of two points in a bounding box defined by the two extreme corner points.
 * This box is therefore aligned to the world X, Y and Z axes.
 */
export class BoundingBox {
  private minX: number;
  private minY: number;
  private minZ: number;
  private maxX: number;
  private maxY: number;
  private maxZ: number;

  /**
   * Constructs a bounding box from numeric extremes.
   * @param minX Minimum X value.
   * @param minY Minimum Y value.
   * @param minZ Minimum Z value.
   * @param maxX Maximum X value.
   * @param maxY Maximum Y value.
   * @param maxZ Maximum Z value.
   * @returns A new bounding box.
   */
  constructor(minX: number, minY: number, minZ: number, maxX: number, maxY: number, maxZ: number) {
    this.minX = minX;
    this.minY = minY;
    this.minZ = minZ;
    this.maxX = maxX;
    this.maxY = maxY;
    this.maxZ = maxZ;
  }

  // #region Properties
  /**
   * Gets an [Empty] bounding box. An Empty box is an invalid structure that has negative width.
   */
  public static get Empty(): BoundingBox {
    return new BoundingBox(1, 0, 0, -1, 0, 0);
  }

  /**
   * Gets a value that indicates whether or not this bounding box is valid. Empty boxes are not valid, and neither are boxes with unset points.
   */
  public get IsValid(): boolean {
    return this.minX <= this.maxX && this.minY <= this.maxY && this.minZ <= this.maxZ;
  }

  /**
   * Gets the area of this BoundingBox. If a bounding box is invalid, the area is 0.
   */
  public get Area(): number {
    if (!this.IsValid) return 0;
    return (this.maxX - this.minX) * (this.maxY - this.minY) * (this.maxZ - this.minZ) * 2;
  }

  /**
   * Gets or sets the point in the minimal corner.
   */
  public get Min(): Vector3d {
    return new Vector3d(this.minX, this.minY, this.minZ);
  }

  /**
   * Gets or sets the point in the minimal corner.
   */
  public set Min(min: Vector3d) {
    this.minX = min.X;
    this.minY = min.Y;
    this.minZ = min.Z;
  }

  /**
   * Gets or sets the point in the maximal corner.
   */
  public get Max(): Vector3d {
    return new Vector3d(this.maxX, this.maxY, this.maxZ);
  }

  /**
   * Gets or sets the point in the maximal corner.
   */
  public set Max(max: Vector3d) {
    this.maxX = max.X;
    this.maxY = max.Y;
    this.maxZ = max.Z;
  }

  /**
   * Gets the point in the center of the bounding box.
   */
  public get Center(): Vector3d {
    return new Vector3d((this.maxX + this.minX) / 2, (this.maxY + this.minY) / 2, (this.maxZ + this.minZ) / 2);
  }

  /**
   * Gets the diagonal vector of this BoundingBox. The diagonal connects the Min and Max points.
   */
  public get Diagonal(): Vector3d {
    return this.Max.Subtract(this.Min);
  }

  /**
   * Gets the volume of this BoundingBox. If a bounding box is invalid, the volume is 0.
   */
  public get Volume(): number {
    if (!this.IsValid) return 0;
    return (this.maxX - this.minX) * (this.maxY - this.minY) * (this.maxZ - this.minZ);
  }

  /**
   * Determines whether a bounding box is degenerate (flat) in one or more directions.
   * 0 = box is not degenerate;
   * 1 = box is a rectangle (degenerate in one direction);
   * 2 = box is a line (degenerate in two directions);
   * 3 = box is a point (degenerate in three directions);
   * 4 = box is not valid.
   */
  public get IsDegenerate(): number {
    if (!this.IsValid) return 4;
    let degenerate = 0;
    if (Open3d.equals(this.minX, this.maxX)) degenerate++;
    if (Open3d.equals(this.minY, this.maxY)) degenerate++;
    if (Open3d.equals(this.minZ, this.maxZ)) degenerate++;
    return degenerate;
  }

  // #endregion

  // #region Methods

  /**
   * Creates a new bounding box from two corner points.
   * @param min Point containing all the minimum coordinates (minX, minY, minZ).
   * @param max Point containing all the maximum coordinates (maxX, maxY, maxZ).
   */
  public static CreateBoundingBoxFromTwoCorners(min: Vector3d, max: Vector3d): BoundingBox {
    return new BoundingBox(min.X, min.Y, min.Z, max.X, max.Y, max.Z);
  }

  /**
   * Finds the closest point on or in the bounding box.
   * @param testPoint Sample point.
   * @param includeInterior If false, the point is projected onto the boundary faces only, otherwise the interior of the box is also taken into consideration. default true
   * @returns The point on or in the box that is closest to the sample point.
   */
  public ClosestPoint(testPoint: Vector3d, includeInterior: boolean = true): Vector3d {
    let x = testPoint.X;
    let y = testPoint.Y;
    let z = testPoint.Z;

    if (x < this.minX) x = this.minX;
    else if (x > this.maxX) x = this.maxX;

    if (y < this.minY) y = this.minY;
    else if (y > this.maxY) y = this.maxY;

    if (z < this.minZ) z = this.minZ;
    else if (z > this.maxZ) z = this.maxZ;

    if (!includeInterior) {
      if (x - this.minX < this.maxX - x) x = this.minX;
      else x = this.maxX;

      if (y - this.minY < this.maxY - y) y = this.minY;
      else y = this.maxY;

      if (z - this.minZ < this.maxZ - z) z = this.minZ;
      else z = this.maxZ;
    }

    return new Vector3d(x, y, z);
  }

  /**
   * An array of eight 3-D points that define the bounding box if successful.
   * Points are returned in counter-clockwise order starting with the bottom rectangle of the box.
   * As in below diagram, the Min is 0 and Max is 6.
   * =========================== 7 ==============================
   * ============= 4 ======================== 6 =================
   * ============================ 5 ============================
   * ============================================================
   * ============================================================
   * ============================================================
   * ============================================================
   * =========================== 3 ==============================
   * ======================================== 2 =================
   * ============= 0 ============================================
   * ============================= 1 ============================
   * [0] Min.X, Min.Y, Min.Z
   * [1] Max.X, Min.Y, Min.Z
   * [2] Max.X, Max.Y, Min.Z
   * [3] Min.X, Max.Y, Min.Z
   * [4] Min.X, Min.Y, Max.Z
   * [5] Max.X, Min.Y, Max.Z
   * [6] Max.X, Max.Y, Max.Z
   * [7] Min.X, Max.Y, Max.Z
   */
  public GetCorners(): Array8Points {
    const c0 = new Vector3d(this.minX, this.minY, this.minZ);
    const c1 = new Vector3d(this.maxX, this.minY, this.minZ);
    const c2 = new Vector3d(this.maxX, this.maxY, this.minZ);
    const c3 = new Vector3d(this.minX, this.maxY, this.minZ);
    const c4 = new Vector3d(this.minX, this.minY, this.maxZ);
    const c5 = new Vector3d(this.maxX, this.minY, this.maxZ);
    const c6 = new Vector3d(this.maxX, this.maxY, this.maxZ);
    const c7 = new Vector3d(this.minX, this.maxY, this.maxZ);

    return [c0, c1, c2, c3, c4, c5, c6, c7];
  }

  /**
   * Gets one of the eight corners of the box.
   * @param minX true for the minimum on the X axis; false for the maximum.
   * @param minY true for the minimum on the Y axis; false for the maximum.
   * @param minZ true for the minimum on the Z axis; false for the maximum.
   * @returns The corner point.
   */
  public GetCorner(minX: boolean, minY: boolean, minZ: boolean): Vector3d {
    const x = minX ? this.minX : this.maxX;
    const y = minY ? this.minY : this.maxY;
    const z = minZ ? this.minZ : this.maxZ;

    return new Vector3d(x, y, z);
  }

  /**
   * Tests a point for BoundingBox inclusion.
   * @param testPoint Point to test.
   * @param strict If true, the point needs to be fully on the inside of the BoundingBox. I.e. coincident points will be considered 'outside'.
   * @returns If 'strict' is affirmative, true if the point is inside this bounding box; false if it is on the surface or outside. If 'strict' is negative, true if the point is on the surface or on the inside of the bounding box; otherwise false.
   */
  public ContainsPoint(testPoint: Vector3d, strict: boolean = true): boolean {
    const x = testPoint.X;
    const y = testPoint.Y;
    const z = testPoint.Z;

    if (strict) {
      return x >= this.minX && x <= this.maxX && y >= this.minY && y <= this.maxY && z >= this.minZ && z <= this.maxZ;
    } else {
      return x > this.minX && x < this.maxX && y > this.minY && y < this.maxY && z > this.minZ && z < this.maxZ;
    }
  }

  /**
   * Determines whether this bounding box contains another bounding box.
   * @param testBox box to test.
   * @param strict f true, the box needs to be fully on the inside of the bounding box. I.e. coincident boxes will be considered 'outside'.
   * @returns If 'strict' is affirmative, true if the box is inside this bounding box; false if it is on the surface or outside. If 'strict' is negative, true if the point is on the surface or on the inside of the bounding box; otherwise false.
   */
  public ContainsBoundingBox(testBox: BoundingBox, strict: boolean = true): boolean {
    const allPoints = testBox.GetCorners();

    return allPoints.every((point) => this.ContainsPoint(point, strict));
  }

  /**
   * Returns a clone of this bounding box.
   */
  public Clone(): BoundingBox {
    return new BoundingBox(this.minX, this.maxX, this.minY, this.maxY, this.minZ, this.maxZ);
  }

  /**
   * Inflates the box with equal amounts in all directions. Inflating with negative amounts may result in decreasing boxes. InValid boxes can not be inflated and will return a clone of itself.
   * @param amount Amount to inflate the box.
   * @returns A new inflated box or a clone of itself if it is invalid.
   */
  public InflateEqual(amount: number): BoundingBox {
    return this.Inflate(amount, amount, amount);
  }

  /**
   * Returns a new inflated box with custom amounts in all directions. Inflating with negative amounts may result in decreasing boxes. InValid boxes can not be inflated and will return a clone of itself.
   * @param xAmount Amount to inflate this box in the x direction.
   * @param yAmount Amount to inflate this box in the y direction.
   * @param zAmount Amount to inflate this box in the z direction.
   * @returns A new inflated box or a clone of itself if it is invalid.
   */
  public Inflate(xAmount: number, yAmount: number, zAmount: number): BoundingBox {
    if (!this.IsValid) return this.Clone();

    const newMinX = this.minX - xAmount;
    const newMaxX = this.maxX + xAmount;
    const newMinY = this.minY - yAmount;
    const newMaxY = this.maxY + yAmount;
    const newMinZ = this.minZ - zAmount;
    const newMaxZ = this.maxZ + zAmount;

    return new BoundingBox(newMinX, newMaxX, newMinY, newMaxY, newMinZ, newMaxZ);
  }

  /**
   * Determines whether a boundingbox is equal to another boundingbox.
   * @param other A Boundingbox.
   * @returns true if other has the same coordinates as this; otherwise false.
   */
  public Equals(other: BoundingBox): boolean {
    return (
      Open3d.equals(this.minX, other.minX) &&
      Open3d.equals(this.minY, other.minY) &&
      Open3d.equals(this.minZ, other.minZ) &&
      Open3d.equals(this.maxX, other.maxX) &&
      Open3d.equals(this.maxY, other.maxY) &&
      Open3d.equals(this.maxZ, other.maxZ)
    );
  }

  /**
   * Evaluates the bounding box with normalized parameters. The box has idealized side length of 1x1x1.
   * @param tx Normalized (between 0 and 1 is inside the box) parameter along the X direction.
   * @param ty Normalized (between 0 and 1 is inside the box) parameter along the Y direction.
   * @param tz Normalized (between 0 and 1 is inside the box) parameter along the Z direction.
   * @returns The point at the {tx, ty, tz} parameters.
   */
  public PointAt(tx: number, ty: number, tz: number): Vector3d {
    const x = this.minX + (this.maxX - this.minX) * tx;
    const y = this.minY + (this.maxY - this.minY) * ty;
    const z = this.minZ + (this.maxZ - this.minZ) * tz;

    return new Vector3d(x, y, z);
  }

  /**
   * Computes the intersection of two bounding boxes. Invalid boxes are ignored and will not affect the intersection.
   * If both boxes are invalid, the union will return an empty boundingbox.
   * @param a A BoundingBox.
   * @param b Another BoundingBox.
   * @returns An intersected BoundingBox.
   */
  public static Intersect(a: BoundingBox, b: BoundingBox): BoundingBox {
    if (!a.IsValid && !b.IsValid) return BoundingBox.Empty;
    if (!a.IsValid) return b.Clone();
    if (!b.IsValid) return a.Clone();

    const minX = Math.max(a.minX, b.minX);
    const minY = Math.max(a.minY, b.minY);
    const minZ = Math.max(a.minZ, b.minZ);
    const maxX = Math.min(a.maxX, b.maxX);
    const maxY = Math.min(a.maxY, b.maxY);
    const maxZ = Math.min(a.maxZ, b.maxZ);

    return new BoundingBox(minX, maxX, minY, maxY, minZ, maxZ);
  }

  /**
   * Returns a new BoundingBox that represents the union of boxes a and b. Invalid boxes are ignored and will not affect the union.
   * If both boxes are invalid, the union will return an empty boundingbox.
   * @param a A BoundingBox.
   * @param b Another BoundingBox.
   * @returns A unioned BoundingBox.
   */
  public static Union(a: BoundingBox, b: BoundingBox): BoundingBox {
    if (!a.IsValid && !b.IsValid) return BoundingBox.Empty;
    if (!a.IsValid) return b.Clone();
    if (!b.IsValid) return a.Clone();

    const minX = Math.min(a.minX, b.minX);
    const minY = Math.min(a.minY, b.minY);
    const minZ = Math.min(a.minZ, b.minZ);
    const maxX = Math.max(a.maxX, b.maxX);
    const maxY = Math.max(a.maxY, b.maxY);
    const maxZ = Math.max(a.maxZ, b.maxZ);

    return new BoundingBox(minX, maxX, minY, maxY, minZ, maxZ);
  }

  // #endregion
}
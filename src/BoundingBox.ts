import { Transform } from './Transform';
import { Vector3d } from './Vector3d';
import { Point3d } from './Point3d';
import { Open3dMath } from './Open3dMath';

/**
 * a type that has an array of 8 points
 */
export type Array8Points = [Point3d, Point3d, Point3d, Point3d, Point3d, Point3d, Point3d, Point3d];

/**
 * Represents the value of two points in a bounding box defined by the two extreme corner points.
 * This box is therefore aligned to the world X, Y and Z axes.
 */
export class BoundingBox {
  /**
   * Gets or sets the point in the minimal corner.
   */
  public Min: Point3d;

  /**
   * Gets or sets the point in the maximal corner.
   */
  public Max: Point3d;

  /**
   * Creates a new bounding box from two corner points.
   * @param min Point containing all the minimum coordinates (minX, minY, minZ).
   * @param max Point containing all the maximum coordinates (maxX, maxY, maxZ).
   */
  constructor(min: Point3d, max: Point3d) {
    this.Min = min.Clone();
    this.Max = max.Clone();
  }

  // #region Properties
  /**
   * Gets an [Empty] bounding box. An Empty box is an invalid structure that has negative width.
   */
  public static get Empty(): BoundingBox {
    return BoundingBox.CreateFromMinMax(1, 0, 0, -1, 0, 0);
  }

  /**
   * Gets a value that indicates whether or not this bounding box is valid. Empty boxes are not valid, and neither are boxes with unset points.
   */
  public get IsValid(): boolean {
    return this.Min.X <= this.Max.X && this.Min.Y <= this.Max.Y && this.Min.Z <= this.Max.Z;
  }

  /**
   * Gets the area of this BoundingBox. If a bounding box is invalid, the area is 0.
   */
  public get Area(): number {
    if (!this.IsValid) return 0;
    const dx = Math.abs(this.Max.X - this.Min.X);
    const dy = Math.abs(this.Max.Y - this.Min.Y);
    const dz = Math.abs(this.Max.Z - this.Min.Z);
    return 2 * (dx * dy + dy * dz + dz * dx);
  }

  /**
   * Gets the point in the center of the bounding box.
   */
  public get Center(): Point3d {
    return new Point3d((this.Max.X + this.Min.X) / 2, (this.Max.Y + this.Min.Y) / 2, (this.Max.Z + this.Min.Z) / 2);
  }

  /**
   * Gets the diagonal vector of this BoundingBox. The diagonal connects the Min and Max points.
   */
  public get Diagonal(): Vector3d {
    return this.Max.SubtractPoint(this.Min);
  }

  /**
   * Gets the volume of this BoundingBox. If a bounding box is invalid, the volume is 0.
   */
  public get Volume(): number {
    if (!this.IsValid) return 0;
    return (this.Max.X - this.Min.X) * (this.Max.Y - this.Min.Y) * (this.Max.Z - this.Min.Z);
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
    if (Open3dMath.EpsilonEquals(this.Min.X, this.Max.X)) degenerate++;
    if (Open3dMath.EpsilonEquals(this.Min.Y, this.Max.Y)) degenerate++;
    if (Open3dMath.EpsilonEquals(this.Min.Z, this.Max.Z)) degenerate++;
    return degenerate;
  }

  // #endregion

  // #region Methods
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
  public static CreateFromMinMax(minX: number, minY: number, minZ: number, maxX: number, maxY: number, maxZ: number) {
    return new BoundingBox(new Point3d(minX, minY, minZ), new Point3d(maxX, maxY, maxZ));
  }

  /**
   * Constructs a boundingbox from a collection of 8 points.
   * @param points
   * @returns
   */
  public static CreateFromPoints(points: Array8Points): BoundingBox {
    let minX = Number.MAX_VALUE;
    let minY = Number.MAX_VALUE;
    let minZ = Number.MAX_VALUE;
    let maxX = Number.MIN_VALUE;
    let maxY = Number.MIN_VALUE;
    let maxZ = Number.MIN_VALUE;

    for (let i = 0; i < points.length; i++) {
      const p = points[i];
      if (p.X < minX) minX = p.X;
      if (p.Y < minY) minY = p.Y;
      if (p.Z < minZ) minZ = p.Z;
      if (p.X > maxX) maxX = p.X;
      if (p.Y > maxY) maxY = p.Y;
      if (p.Z > maxZ) maxZ = p.Z;
    }

    return BoundingBox.CreateFromMinMax(minX, minY, minZ, maxX, maxY, maxZ);
  }

  /**
   * Finds the closest point on or in the bounding box.
   * @param testPoint Sample point.
   * @param includeInterior If false, the point is projected onto the boundary faces only, otherwise the interior of the box is also taken into consideration. default true
   * @returns The point on or in the box that is closest to the sample point.
   */
  public ClosestPoint(testPoint: Point3d, includeInterior: boolean = true): Point3d {
    let x = testPoint.X;
    let y = testPoint.Y;
    let z = testPoint.Z;

    if (x < this.Min.X) x = this.Min.X;
    else if (x > this.Max.X) x = this.Max.X;

    if (y < this.Min.Y) y = this.Min.Y;
    else if (y > this.Max.Y) y = this.Max.Y;

    if (z < this.Min.Z) z = this.Min.Z;
    else if (z > this.Max.Z) z = this.Max.Z;

    if (!includeInterior) {
      let minimumDistance = Number.MAX_VALUE;
      minimumDistance = Math.min(minimumDistance, x - this.Min.X);
      minimumDistance = Math.min(minimumDistance, this.Max.X - x);
      minimumDistance = Math.min(minimumDistance, y - this.Min.Y);
      minimumDistance = Math.min(minimumDistance, this.Max.Y - y);
      minimumDistance = Math.min(minimumDistance, z - this.Min.Z);
      minimumDistance = Math.min(minimumDistance, this.Max.Z - z);

      if (x - this.Min.X === minimumDistance) x = this.Min.X;
      else if (this.Max.X - x === minimumDistance) x = this.Max.X;
      else if (y - this.Min.Y === minimumDistance) y = this.Min.Y;
      else if (this.Max.Y - y === minimumDistance) y = this.Max.Y;
      else if (z - this.Min.Z === minimumDistance) z = this.Min.Z;
      else if (this.Max.Z - z === minimumDistance) z = this.Max.Z;
    }

    return new Point3d(x, y, z);
  }

  /**
   * Ensures that the box is defined in an increasing fashion along X, Y and Z axes.
   */
  public MakeValid(): void {
    if (this.Min.X > this.Max.X) {
      const t = this.Min.X;
      this.Min.X = this.Max.X;
      this.Max.X = t;
    }

    if (this.Min.Y > this.Max.Y) {
      const t = this.Min.Y;
      this.Min.Y = this.Max.Y;
      this.Max.Y = t;
    }

    if (this.Min.Z > this.Max.Z) {
      const t = this.Min.Z;
      this.Min.Z = this.Max.Z;
      this.Max.Z = t;
    }
  }

  /**
   * Finds the furthest point on or in the bounding box.
   * @param testPoint Sample point.
   * @returns The point on or in the box that is furthest to the sample point.
   */
  public FurthestPoint(testPoint: Point3d): Point3d {
    let x = testPoint.X;
    let y = testPoint.Y;
    let z = testPoint.Z;
    // Find the mid-point.
    const xm = 0.5 * (this.Min.X + this.Max.X);
    const ym = 0.5 * (this.Min.Y + this.Max.Y);
    const zm = 0.5 * (this.Min.Z + this.Max.Z);

    let fx = this.Min.X;
    let fy = this.Min.Y;
    let fz = this.Min.Z;

    if (x < xm) fx = this.Max.X;
    if (y < ym) fy = this.Max.Y;
    if (z < zm) fz = this.Max.Z;

    return new Point3d(fx, fy, fz);
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
    const c0 = new Point3d(this.Min.X, this.Min.Y, this.Min.Z);
    const c1 = new Point3d(this.Max.X, this.Min.Y, this.Min.Z);
    const c2 = new Point3d(this.Max.X, this.Max.Y, this.Min.Z);
    const c3 = new Point3d(this.Min.X, this.Max.Y, this.Min.Z);
    const c4 = new Point3d(this.Min.X, this.Min.Y, this.Max.Z);
    const c5 = new Point3d(this.Max.X, this.Min.Y, this.Max.Z);
    const c6 = new Point3d(this.Max.X, this.Max.Y, this.Max.Z);
    const c7 = new Point3d(this.Min.X, this.Max.Y, this.Max.Z);

    return [c0, c1, c2, c3, c4, c5, c6, c7];
  }

  /**
   * Gets one of the eight corners of the box.
   * @param minX true for the minimum on the X axis; false for the maximum.
   * @param minY true for the minimum on the Y axis; false for the maximum.
   * @param minZ true for the minimum on the Z axis; false for the maximum.
   * @returns The corner point.
   */
  public GetCorner(minX: boolean, minY: boolean, minZ: boolean): Point3d {
    const x = minX ? this.Min.X : this.Max.X;
    const y = minY ? this.Min.Y : this.Max.Y;
    const z = minZ ? this.Min.Z : this.Max.Z;

    return new Point3d(x, y, z);
  }

  /**
   * Tests a point for BoundingBox inclusion.
   * @param testPoint Point to test.
   * @param strict If true, the point needs to be fully on the inside of the BoundingBox. I.e. coincident points will be considered 'outside'.
   * @returns If 'strict' is affirmative, true if the point is inside this bounding box; false if it is on the surface or outside. If 'strict' is negative, true if the point is on the surface or on the inside of the bounding box; otherwise false.
   */
  public ContainsPoint(testPoint: Point3d, strict: boolean = true): boolean {
    const x = testPoint.X;
    const y = testPoint.Y;
    const z = testPoint.Z;

    if (strict) {
      return x >= this.Min.X && x <= this.Max.X && y >= this.Min.Y && y <= this.Max.Y && z >= this.Min.Z && z <= this.Max.Z;
    } else {
      return x > this.Min.X && x < this.Max.X && y > this.Min.Y && y < this.Max.Y && z > this.Min.Z && z < this.Max.Z;
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
    return new BoundingBox(this.Min, this.Max);
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

    const newMinX = this.Min.X - xAmount;
    const newMinY = this.Min.Y - yAmount;
    const newMinZ = this.Min.Z - zAmount;
    const newMaxX = this.Max.X + xAmount;
    const newMaxY = this.Max.Y + yAmount;
    const newMaxZ = this.Max.Z + zAmount;

    return BoundingBox.CreateFromMinMax(newMinX, newMinY, newMinZ, newMaxX, newMaxY, newMaxZ);
  }

  /**
   * Determines whether a boundingbox is equal to another boundingbox.
   * @param other A Boundingbox.
   * @returns true if other has the same coordinates as this; otherwise false.
   */
  public Equals(other: BoundingBox): boolean {
    return (
      Open3dMath.EpsilonEquals(this.Min.X, other.Min.X) &&
      Open3dMath.EpsilonEquals(this.Min.Y, other.Min.Y) &&
      Open3dMath.EpsilonEquals(this.Min.Z, other.Min.Z) &&
      Open3dMath.EpsilonEquals(this.Max.X, other.Max.X) &&
      Open3dMath.EpsilonEquals(this.Max.Y, other.Max.Y) &&
      Open3dMath.EpsilonEquals(this.Max.Z, other.Max.Z)
    );
  }

  /**
   * Evaluates the bounding box with normalized parameters. The box has idealized side length of 1x1x1.
   * @param tx Normalized (between 0 and 1 is inside the box) parameter along the X direction.
   * @param ty Normalized (between 0 and 1 is inside the box) parameter along the Y direction.
   * @param tz Normalized (between 0 and 1 is inside the box) parameter along the Z direction.
   * @returns The point at the {tx, ty, tz} parameters.
   */
  public PointAt(tx: number, ty: number, tz: number): Point3d {
    const x = this.Min.X + (this.Max.X - this.Min.X) * tx;
    const y = this.Min.Y + (this.Max.Y - this.Min.Y) * ty;
    const z = this.Min.Z + (this.Max.Z - this.Min.Z) * tz;

    return new Point3d(x, y, z);
  }

  /**
   * Transforms the bounding box with a given transform.
   * @param transform
   * @returns
   */
  public Transform(transform: Transform): BoundingBox {
    const corners = this.GetCorners();
    const transformedCorners = corners.map((corner) => corner.Transform(transform)) as Array8Points;

    return BoundingBox.CreateFromPoints(transformedCorners);
  }

  /**
   * Creates a bounding box to represent the union of itself and another box.
   * @param other
   * @remarks If either this BoundingBox or the other BoundingBox is InValid, the Valid BoundingBox will be the only one included in the union.
   * @returns
   */
  public Union(other: BoundingBox): BoundingBox {
    return BoundingBox.Union(this, other);
  }

  /**
   * Creates a bounding box to represent the intersection of itself and another box.
   * @param other
   * @returns
   */
  public Intersect(other: BoundingBox): BoundingBox {
    return BoundingBox.Intersect(this, other);
  }

  /**
   * override toString
   */
  public toString(): string {
    return `${this.Min} - ${this.Max}`;
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

    const minX = Math.max(a.Min.X, b.Min.X);
    const minY = Math.max(a.Min.Y, b.Min.Y);
    const minZ = Math.max(a.Min.Z, b.Min.Z);
    const maxX = Math.min(a.Max.X, b.Max.X);
    const maxY = Math.min(a.Max.Y, b.Max.Y);
    const maxZ = Math.min(a.Max.Z, b.Max.Z);

    return BoundingBox.CreateFromMinMax(minX, minY, minZ, maxX, maxY, maxZ);
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

    const minX = Math.min(a.Min.X, b.Min.X);
    const minY = Math.min(a.Min.Y, b.Min.Y);
    const minZ = Math.min(a.Min.Z, b.Min.Z);
    const maxX = Math.max(a.Max.X, b.Max.X);
    const maxY = Math.max(a.Max.Y, b.Max.Y);
    const maxZ = Math.max(a.Max.Z, b.Max.Z);

    return BoundingBox.CreateFromMinMax(minX, minY, minZ, maxX, maxY, maxZ);
  }

  // #endregion
}

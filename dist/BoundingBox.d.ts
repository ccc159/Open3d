import { Vector3d } from './Vector3d';
/**
 * a type that has an array of 8 points
 */
export declare type Array8Points = [Vector3d, Vector3d, Vector3d, Vector3d, Vector3d, Vector3d, Vector3d, Vector3d];
/**
 * Represents the value of two points in a bounding box defined by the two extreme corner points.
 * This box is therefore aligned to the world X, Y and Z axes.
 */
export declare class BoundingBox {
    private minX;
    private minY;
    private minZ;
    private maxX;
    private maxY;
    private maxZ;
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
    constructor(minX: number, minY: number, minZ: number, maxX: number, maxY: number, maxZ: number);
    /**
     * Gets an [Empty] bounding box. An Empty box is an invalid structure that has negative width.
     */
    static get Empty(): BoundingBox;
    /**
     * Gets a value that indicates whether or not this bounding box is valid. Empty boxes are not valid, and neither are boxes with unset points.
     */
    get IsValid(): boolean;
    /**
     * Gets the area of this BoundingBox. If a bounding box is invalid, the area is 0.
     */
    get Area(): number;
    /**
     * Gets or sets the point in the minimal corner.
     */
    get Min(): Vector3d;
    /**
     * Gets or sets the point in the minimal corner.
     */
    set Min(min: Vector3d);
    /**
     * Gets or sets the point in the maximal corner.
     */
    get Max(): Vector3d;
    /**
     * Gets or sets the point in the maximal corner.
     */
    set Max(max: Vector3d);
    /**
     * Gets the point in the center of the bounding box.
     */
    get Center(): Vector3d;
    /**
     * Gets the diagonal vector of this BoundingBox. The diagonal connects the Min and Max points.
     */
    get Diagonal(): Vector3d;
    /**
     * Gets the volume of this BoundingBox. If a bounding box is invalid, the volume is 0.
     */
    get Volume(): number;
    /**
     * Determines whether a bounding box is degenerate (flat) in one or more directions.
     * 0 = box is not degenerate;
     * 1 = box is a rectangle (degenerate in one direction);
     * 2 = box is a line (degenerate in two directions);
     * 3 = box is a point (degenerate in three directions);
     * 4 = box is not valid.
     */
    get IsDegenerate(): number;
    /**
     * Creates a new bounding box from two corner points.
     * @param min Point containing all the minimum coordinates (minX, minY, minZ).
     * @param max Point containing all the maximum coordinates (maxX, maxY, maxZ).
     */
    static CreateBoundingBoxFromTwoCorners(min: Vector3d, max: Vector3d): BoundingBox;
    /**
     * Finds the closest point on or in the bounding box.
     * @param testPoint Sample point.
     * @param includeInterior If false, the point is projected onto the boundary faces only, otherwise the interior of the box is also taken into consideration. default true
     * @returns The point on or in the box that is closest to the sample point.
     */
    ClosestPoint(testPoint: Vector3d, includeInterior?: boolean): Vector3d;
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
    GetCorners(): Array8Points;
    /**
     * Gets one of the eight corners of the box.
     * @param minX true for the minimum on the X axis; false for the maximum.
     * @param minY true for the minimum on the Y axis; false for the maximum.
     * @param minZ true for the minimum on the Z axis; false for the maximum.
     * @returns The corner point.
     */
    GetCorner(minX: boolean, minY: boolean, minZ: boolean): Vector3d;
    /**
     * Tests a point for BoundingBox inclusion.
     * @param testPoint Point to test.
     * @param strict If true, the point needs to be fully on the inside of the BoundingBox. I.e. coincident points will be considered 'outside'.
     * @returns If 'strict' is affirmative, true if the point is inside this bounding box; false if it is on the surface or outside. If 'strict' is negative, true if the point is on the surface or on the inside of the bounding box; otherwise false.
     */
    ContainsPoint(testPoint: Vector3d, strict?: boolean): boolean;
    /**
     * Determines whether this bounding box contains another bounding box.
     * @param testBox box to test.
     * @param strict f true, the box needs to be fully on the inside of the bounding box. I.e. coincident boxes will be considered 'outside'.
     * @returns If 'strict' is affirmative, true if the box is inside this bounding box; false if it is on the surface or outside. If 'strict' is negative, true if the point is on the surface or on the inside of the bounding box; otherwise false.
     */
    ContainsBoundingBox(testBox: BoundingBox, strict?: boolean): boolean;
    /**
     * Returns a clone of this bounding box.
     */
    Clone(): BoundingBox;
    /**
     * Inflates the box with equal amounts in all directions. Inflating with negative amounts may result in decreasing boxes. InValid boxes can not be inflated and will return a clone of itself.
     * @param amount Amount to inflate the box.
     * @returns A new inflated box or a clone of itself if it is invalid.
     */
    InflateEqual(amount: number): BoundingBox;
    /**
     * Returns a new inflated box with custom amounts in all directions. Inflating with negative amounts may result in decreasing boxes. InValid boxes can not be inflated and will return a clone of itself.
     * @param xAmount Amount to inflate this box in the x direction.
     * @param yAmount Amount to inflate this box in the y direction.
     * @param zAmount Amount to inflate this box in the z direction.
     * @returns A new inflated box or a clone of itself if it is invalid.
     */
    Inflate(xAmount: number, yAmount: number, zAmount: number): BoundingBox;
    /**
     * Determines whether a boundingbox is equal to another boundingbox.
     * @param other A Boundingbox.
     * @returns true if other has the same coordinates as this; otherwise false.
     */
    Equals(other: BoundingBox): boolean;
    /**
     * Evaluates the bounding box with normalized parameters. The box has idealized side length of 1x1x1.
     * @param tx Normalized (between 0 and 1 is inside the box) parameter along the X direction.
     * @param ty Normalized (between 0 and 1 is inside the box) parameter along the Y direction.
     * @param tz Normalized (between 0 and 1 is inside the box) parameter along the Z direction.
     * @returns The point at the {tx, ty, tz} parameters.
     */
    PointAt(tx: number, ty: number, tz: number): Vector3d;
    /**
     * Computes the intersection of two bounding boxes. Invalid boxes are ignored and will not affect the intersection.
     * If both boxes are invalid, the union will return an empty boundingbox.
     * @param a A BoundingBox.
     * @param b Another BoundingBox.
     * @returns An intersected BoundingBox.
     */
    static Intersect(a: BoundingBox, b: BoundingBox): BoundingBox;
    /**
     * Returns a new BoundingBox that represents the union of boxes a and b. Invalid boxes are ignored and will not affect the union.
     * If both boxes are invalid, the union will return an empty boundingbox.
     * @param a A BoundingBox.
     * @param b Another BoundingBox.
     * @returns A unioned BoundingBox.
     */
    static Union(a: BoundingBox, b: BoundingBox): BoundingBox;
}

import { Open3d } from './Open3d';
import { Transform } from './Transform';
import { Vector3d } from './Vector3d';

/**
 * Represents the value of start and end points in a single line segment.
 */
export class Line {
  /**
   * Start point of line segment.
   */
  public From: Vector3d;

  /**
   * End point of line segment.
   */
  public To: Vector3d;

  /**
   * Constructs a new line segment between two points.
   * @param x
   * @param y
   * @param z
   */
  constructor(from: Vector3d, to: Vector3d) {
    this.From = from;
    this.To = to;
  }

  // #region Properties

  /**
   * Gets the direction of this line segment. The length of the direction vector equals the length of the line segment.
   */
  public get Direction(): Vector3d {
    return this.To.Subtract(this.From);
  }

  /**
   * Gets the direction of this line segment. The length of the direction vector is 1.
   */
  public get UnitDirection(): Vector3d {
    return this.Direction.Unitize();
  }

  /**
   * Gets the length of this line segment.
   */
  public get Length(): number {
    return this.Direction.Length;
  }

  /**
   * Determines whether this line is valid.
   * A line is not valid when the start and end points are the same point.
   */
  public get IsValid(): boolean {
    return !this.From.Equals(this.To);
  }

  /**
   * Sets the length of this line segment. Note that a negative length will invert the line segment without making the actual length negative. The line From point will remain fixed when a new Length is set.
   */
  public set Length(l: number) {
    let dir = this.UnitDirection;
    if (l < 0) dir = dir.Reverse();

    this.To = this.From.Add(dir.Multiply(Math.abs(l)));
  }

  // #endregion

  // #region Methods

  /**
   * Make a copy of this line.
   */
  public Clone(): Line {
    return new Line(this.From, this.To);
  }

  /**
   * Evaluates the line at the specified parameter.
   * @param param Parameter to evaluate line segment at. Line parameters are normalized parameters.
   * @returns The point at the specified parameter.
   */
  public PointAt(param: number): Vector3d {
    return this.Direction.Multiply(param).Add(this.From);
  }

  /**
   * Computes a point located at a specific metric distance from the line origin (From). If line start and end coincide, then the start point is always returned.
   * @param distance A positive, 0, or a negative value that will be the distance from From.
   * @returns The newly found point.
   */
  public PointAtLength(distance: number): Vector3d {
    return this.UnitDirection.Multiply(distance).Add(this.From);
  }

  /**
   * Finds the parameter on the (in)finite line segment that is closest to a test point.
   * @param testPoint Point to project onto the line.
   * @param limitToFiniteSegment If true, the projection is limited to the finite line segment. default: false
   * @returns The parameter on the line that is closest to testPoint.
   */
  public ClosestParameter(testPoint: Vector3d, limitToFiniteSegment: boolean = false): number {
    const startToP = testPoint.Subtract(this.From);
    const startToEnd = this.To.Subtract(this.From);

    const startEnd2 = startToEnd.DotProduct(startToEnd);
    const startEnd_startP = startToEnd.DotProduct(startToP);

    let t = startEnd_startP / startEnd2;

    if (limitToFiniteSegment) {
      t = Open3d.Clamp(t, 0, 1);
    }

    return t;
  }

  /**
   * Finds the point on the (in)finite line segment that is closest to a test point.
   * @param testPoint Point to project onto the line.
   * @param limitToFiniteSegment If true, the projection is limited to the finite line segment. default: false
   * @returns The point on the (in)finite line that is closest to testPoint.
   */
  public ClosestPoint(testPoint: Vector3d, limitToFiniteSegment: boolean = false): Vector3d {
    const t = this.ClosestParameter(testPoint, limitToFiniteSegment);

    return this.PointAt(t);
  }

  /**
   * Compute the shortest distance between this line segment and a test point.
   * @param testPoint Point for distance computation.
   * @param limitToFiniteSegment If true, the distance is limited to the finite line segment. default: false
   * @returns The shortest distance between this line segment and testPoint.
   */
  public DistanceTo(testPoint: Vector3d, limitToFiniteSegment: boolean = false): number {
    const closestPt = this.ClosestPoint(testPoint, limitToFiniteSegment);
    return closestPt.DistanceTo(testPoint);
  }

  /**
   * Determines whether a line has the same value as this line.
   * @param other A line.
   * @returns true if other has the same coordinates as this; otherwise false.
   */
  public Equals(other: Line): boolean {
    return this.From.Equals(other.From) && this.To.Equals(other.To);
  }

  /**
   * Extend the line by custom distances on both sides.
   * @param startLength Distance to extend the line at the start point. Positive distance result in longer lines.
   * @param endLength Distance to extend the line at the end point. Positive distance result in longer lines.
   * @returns The extended line.
   */
  public Extend(startLength: number, endLength: number): Line {
    const startPt = this.UnitDirection.Multiply(-startLength).Add(this.From);
    const endPt = this.UnitDirection.Multiply(endLength).Add(this.To);
    return new Line(startPt, endPt);
  }

  /**
   * Flip the endpoints of the line segment.
   * @returns A new flipped line.
   */
  public Flip(): Line {
    return new Line(this.To, this.From);
  }

  /**
   * Try to get an intersection point between this line and another line.
   * If there's no intersection, null is returned.
   * @param other Line to intersect with.
   * @returns The intersection point, or null if there's no intersection.
   */
  public LineLineIntersection(other: Line): Vector3d | null {
    // http://paulbourke.net/geometry/pointlineplane/
    if (!this.IsValid || !other.IsValid) return null;
    const p1 = this.From;
    const p2 = this.To;
    const p3 = other.From;
    const p4 = other.To;
    const p13 = p1.Subtract(p3);
    const p43 = p4.Subtract(p3);
    const p21 = p2.Subtract(p1);

    const d1343 = p13.X * p43.X + p13.Y * p43.Y + p13.Z * p43.Z;
    const d4321 = p43.X * p21.X + p43.Y * p21.Y + p43.Z * p21.Z;
    const d1321 = p13.X * p21.X + p13.Y * p21.Y + p13.Z * p21.Z;
    const d4343 = p43.X * p43.X + p43.Y * p43.Y + p43.Z * p43.Z;
    const d2121 = p21.X * p21.X + p21.Y * p21.Y + p21.Z * p21.Z;

    const denom = d2121 * d4343 - d4321 * d4321;
    if (Open3d.equals(denom, 0)) {
      return null;
    }
    const numer = d1343 * d4321 - d1321 * d4343;

    const mua = numer / denom;
    const mub = (d1343 + d4321 * mua) / d4343;

    const pointA = new Vector3d(p1.X + mua * p21.X, p1.Y + mua * p21.Y, p1.Z + mua * p21.Z);
    const pointB = new Vector3d(p3.X + mub * p43.X, p3.Y + mub * p43.Y, p3.Z + mub * p43.Z);

    return pointA.Equals(pointB) ? pointA : null;
  }

  /**
   * Transform the line using a Transformation matrix.
   * @param transformation Transformation matrix to apply.
   */
  public Transform(transformation: Transform): Line {
    const start = this.From.Transform(transformation);
    const end = this.To.Transform(transformation);
    return new Line(start, end);
  }
  // #endregion
}

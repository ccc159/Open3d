import { BoundingBox } from './BoundingBox';
import { Intersection } from './Intersection';
import { Open3d } from './Open3d';
import { Open3dMath } from './Open3dMath';
import { Plane } from './Plane';
import { Point3d } from './Point3d';
import { Transform } from './Transform';
import { Vector3d } from './Vector3d';

/**
 * Represents the value of start and end points in a single line segment.
 */
export class Line {
  /**
   * Start point of line segment.
   */
  public From: Point3d;

  /**
   * End point of line segment.
   */
  public To: Point3d;

  /**
   * Constructs a new line segment between two points.
   * @param from the from point
   * @param to the to point
   */
  constructor(from: Point3d, to: Point3d) {
    this.From = from;
    this.To = to;
  }

  // #region Properties

  /**
   * Determines whether this line is valid.
   * A line is not valid when the start and end points are the same point.
   */
  public get IsValid(): boolean {
    return !this.From.Equals(this.To);
  }

  /**
   * Gets the direction of this line segment. The length of the direction vector equals the length of the line segment.
   */
  public get Direction(): Vector3d {
    if (!this.IsValid) throw new Error('Cannot get direction of an invalid line.');
    return this.To.SubtractPoint(this.From);
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
    return this.To.DistanceTo(this.From);
  }

  /**
   * Sets the length of this line segment. Note that a negative length will invert the line segment without making the actual length negative. The line From point will remain fixed when a new Length is set.
   */
  public set Length(l: number) {
    let dir = this.UnitDirection;
    if (l < 0) dir = dir.Reverse();

    this.To = this.From.Add(dir.Multiply(Math.abs(l)));
  }

  /**
   * Gets the line's 3d axis aligned bounding box.
   */
  public get BoundingBox(): BoundingBox {
    if (!this.IsValid) return BoundingBox.Empty;
    const bb = new BoundingBox(this.From, this.To);
    bb.MakeValid();
    return bb;
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
  public PointAt(param: number): Point3d {
    if (!this.IsValid) throw new Error('Cannot evaluate an invalid line.');
    return this.Direction.Multiply(param).AddToPoint(this.From);
  }

  /**
   * Computes a point located at a specific metric distance from the line origin (From). If line start and end coincide, then the start point is always returned.
   * @param distance A positive, 0, or a negative value that will be the distance from From.
   * @returns The newly found point.
   */
  public PointAtLength(distance: number): Point3d {
    if (!this.IsValid) throw new Error('Cannot evaluate an invalid line.');
    return this.UnitDirection.Multiply(distance).AddToPoint(this.From);
  }

  /**
   * Finds the parameter on the (in)finite line segment that is closest to a test point.
   * @param testPoint Point to project onto the line.
   * @param limitToFiniteSegment If true, the projection is limited to the finite line segment. default: false
   * @returns The parameter on the line that is closest to testPoint.
   */
  public ClosestParameter(testPoint: Point3d, limitToFiniteSegment: boolean = false): number {
    if (!this.IsValid) throw new Error('Invalid line does not have a closest point.');
    const startToP = testPoint.SubtractPoint(this.From);
    const startToEnd = this.To.SubtractPoint(this.From);

    const startEnd2 = startToEnd.DotProduct(startToEnd);
    const startEnd_startP = startToEnd.DotProduct(startToP);

    let t = startEnd_startP / startEnd2;

    if (limitToFiniteSegment) {
      t = Open3dMath.Clamp(t, 0, 1);
    }

    return t;
  }

  /**
   * Finds the point on the (in)finite line segment that is closest to a test point.
   * @param testPoint Point to project onto the line.
   * @param limitToFiniteSegment If true, the projection is limited to the finite line segment. default: false
   * @returns The point on the (in)finite line that is closest to testPoint.
   */
  public ClosestPoint(testPoint: Point3d, limitToFiniteSegment: boolean = false): Point3d {
    const t = this.ClosestParameter(testPoint, limitToFiniteSegment);

    return this.PointAt(t);
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
   * Checks if a point is on the line.
   * @param point  Point to check.
   * @param limitToFiniteSegment If true, the check is limited on the finite line. default: false
   * @param tolerance
   * @returns
   */
  public IsPointOn(point: Point3d, limitToFiniteSegment: boolean = false, tolerance: number = Open3d.EPSILON): boolean {
    const d = this.DistanceTo(point, limitToFiniteSegment);
    return d <= tolerance;
  }

  /**
   * Extend the line by custom distances on both sides.
   * @param startLength Distance to extend the line at the start point. Positive distance result in longer lines.
   * @param endLength Distance to extend the line at the end point. Positive distance result in longer lines.
   * @returns The extended line.
   */
  public Extend(startLength: number, endLength: number): Line {
    if (!this.IsValid) throw new Error('Cannot extend an invalid line.');
    const startPt = this.UnitDirection.Multiply(-startLength).AddToPoint(this.From);
    const endPt = this.UnitDirection.Multiply(endLength).AddToPoint(this.To);
    return new Line(startPt, endPt);
  }

  /**
   * Compute the shortest distance between this line segment and a test point.
   * @param other Other geometry to calculate the distance to.
   * @param limitToFiniteSegment If true, the distance is limited to the finite line segment. default: false
   * @returns The shortest distance between this line segment and testPoint.
   */
  public DistanceTo(other: Point3d | Line | Plane, limitToFiniteSegment: boolean = false): number {
    if (other instanceof Line) return Line.LineLineDistance(this, other, limitToFiniteSegment);
    if (other instanceof Plane) return Line.LinePlaneDistance(this, other, limitToFiniteSegment);
    return Line.LinePointDistance(this, other, limitToFiniteSegment);
  }

  /**
   * Flip the endpoints of the line and return a new line.
   * @returns A new flipped line.
   */
  public Flip(): Line {
    return new Line(this.To, this.From);
  }

  /**
   * Transform the line using a Transformation matrix.
   * @param transformation Transformation matrix to apply.
   * @returns A new transformed line.
   */
  public Transform(transformation: Transform): Line {
    const start = this.From.Transform(transformation);
    const end = this.To.Transform(transformation);
    return new Line(start, end);
  }
  // #endregion

  // #region Static Methods

  /**
   * Creates a line from start point and span vector
   * @param origin A point on the line.
   * @param direction A direction vector.
   * @param length (optional) the length of the line. If not provided, the length will be the length of the direction vector.
   * @returns A line.
   */
  public static CreateFromOriginAndDirection(origin: Point3d, direction: Vector3d, length?: number): Line {
    return new Line(origin, origin.Add(length ? direction.Unitize().Multiply(length) : direction));
  }

  /**
   * Private static method to compute the parameter value t of the closest point on a line segment to a given point.
   * @param line
   * @param point
   * @returns number (t Parameter)
   */
  public static LinePointClosestParameter(line: Line, point: Point3d): number {
    if (!line.IsValid) return 0;
    const startToP = point.SubtractPoint(line.From);
    const startToEnd = line.To.SubtractPoint(line.From);

    const startEnd2 = startToEnd.DotProduct(startToEnd);
    const startEnd_startP = startToEnd.DotProduct(startToP);

    const t = startEnd_startP / startEnd2;
    return t;
  }

  /**
   * Static method for computing the closest point on a line to a given point
   * @param line given line
   * @param point given point
   * @param limitToFiniteSegment whether the line is considered infinite or not
   * @returns Point3d
   */
  public static LinePointClosestPoint(line: Line, point: Point3d, limitToFiniteSegment?: boolean): Point3d {
    let t = Line.LinePointClosestParameter(line, point);
    if (limitToFiniteSegment) t = Open3dMath.Clamp(t, 0, 1);
    return line.PointAt(t);
  }

  /**
   * Static method for computing the closest distance of a point to a line
   * @param line given line
   * @param point testPoint
   * @param limitToFiniteSegment whether the line is considered infinite or not
   * @returns number
   */
  public static LinePointDistance(line: Line, point: Point3d, limitToFiniteSegment?: boolean): number {
    const closestPoint = Line.LinePointClosestPoint(line, point, limitToFiniteSegment);
    return point.DistanceTo(closestPoint);
  }

  /**
   * Static method to find the points closest to two lines given (crossing or intersecting) lines
   * @param line1
   * @param line2
   * @param limitToFiniteSegments whether the points need to be part of the line segments
   * @returns [point1, point2] | null if the lines are parallel
   */
  public static LineLineClosestPoints = (line1: Line, line2: Line, limitToFiniteSegments: boolean): [Point3d, Point3d] | null => {
    const result = Intersection.CrossingLineLine(line1, line2, limitToFiniteSegments);
    if (result) return [result.PointA, result.PointB];
    return null;
  };

  /**
   * Static method for computing the closest distance of two lines
   * @param line1
   * @param line2
   * @param limitToFiniteSegments
   * @returns
   */
  public static LineLineDistance = (line1: Line, line2: Line, limitToFiniteSegments: boolean): number => {
    const result = Intersection.CrossingLineLine(line1, line2, limitToFiniteSegments);
    if (!result)
      return limitToFiniteSegments
        ? Math.min(
            // parallel case
            Line.LinePointDistance(line2, line1.From),
            Line.LinePointDistance(line2, line1.To),
            Line.LinePointDistance(line1, line2.From),
            Line.LinePointDistance(line1, line2.To)
          )
        : Line.LinePointDistance(line1, line2.From);
    return result.PointA.DistanceTo(result.PointB);
  };

  /**
   * Static method to calculate the distance between a line and a plane
   * @param line
   * @param plane
   * @param limitToFiniteSegment - only applies to the line
   * @returns
   */
  public static LinePlaneDistance = (line: Line, plane: Plane, limitToFiniteSegment?: boolean): number => {
    if (Intersection.LinePlane(line, plane, limitToFiniteSegment)) return 0; // intersecting
    if (limitToFiniteSegment) return Math.min(plane.DistanceTo(line.From), plane.DistanceTo(line.To)); // not intersecting but maybe not parallel
    return plane.DistanceTo(line.From); // just parallel
  };

  // #endregion
}

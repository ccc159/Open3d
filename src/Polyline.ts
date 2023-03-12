import { Line } from './Line';
import { Point3dList } from './List';
import { Open3d } from './Open3d';
import { Plane } from './Plane';
import { Point3d } from './Point3d';
import { Transform } from './Transform';
import { Vector3d } from './Vector3d';

/**
 * Represents an ordered set of points connected by linear segments.
 * @remarks The polyline is using the Array class as its base class. So you can use all Array methods on a polyline.
 * @remarks Polylines are closed if start and end points coincide.
 */
export class Polyline extends Point3dList {
  /**
   * Init a new polyline from a list of points.
   * @param points The points that define the polyline.
   */
  public constructor(points: Point3d[]) {
    super(points);
  }

  //#region Properties
  /**
   * Compute the center point of the polyline as the weighted average of all segments.
   */
  public get CenterPoint(): Point3d {
    const count = this.Count;
    if (count === 0) {
      return Point3d.Origin;
    }
    if (count === 1) {
      return this.Get(0);
    }

    let center = Point3d.Origin;
    let weight = 0.0;

    for (let i = 0; i < count - 1; i++) {
      let A = this.Get(i);
      let B = this.Get(i + 1);
      let d = A.DistanceTo(B);
      center = center.AddPoint(Point3d.AddPoint(A, B).Multiply(d * 0.5));
      weight += d;
    }
    center = center.Divide(weight);
    return center;
  }

  /**
   * Gets a value that indicates whether this polyline is valid.
   * @remarks Valid polylines have at least one segment, no Invalid points and no zero length segments.
   * @remarks Closed polylines with only two segments are also not considered valid.
   */
  public get IsValid(): boolean {
    if (this.Count < 2) return false;
    for (let i = 1; i < this.Count; i++) {
      if (this.Get(i).Equals(this.Get(i - 1))) {
        return false;
      }
    }
    if (this.Count < 4 && this.IsClosed) return false;
    return true;
  }

  /**
   * Gets the number of segments for this polyline.
   */
  public get SegmentCount(): number {
    return Math.max(0, this.Count - 1);
  }

  /**
   * Gets a value that indicates whether this polyline is closed.
   * @remarks The polyline is considered to be closed if its start is identical to its endpoint.
   * @remarks Polylines less than 3 points long are not considered closed.
   */
  public get IsClosed(): boolean {
    return this.Count > 2 && this.First.Equals(this.Last);
  }

  /**
   * Gets the total length of the polyline.
   */
  public get Length(): number {
    if (this.Count < 2) return 0;
    let length = 0;
    for (let i = 0; i < this.Count - 1; i++) {
      length += this.Get(i).DistanceTo(this.Get(i + 1));
    }
    return length;
  }

  //#endregion

  /**
   * Determines whether the polyline is closed, provided a tolerance value.
   * @param tolerance If the distance between the start and end point of the polyline is less than tolerance, the polyline is considered to be closed.
   * @returns true if the polyline is closed to within tolerance, false otherwise.
   */
  public IsClosedWithinTolerance(tolerance: number): boolean {
    if (this.Count <= 2) return false;
    return this.First.DistanceTo(this.Last) <= tolerance;
  }

  //#region Methods

  /**
   * Gets the point on the polyline at the given parameter.
   * @param t The integer part of the parameter indicates the index of the segment. like `1.4`
   * @returns Polyline parameter.
   */
  public PointAt(t: number): Point3d {
    const count = this.Count;
    if (count < 1) {
      return Point3d.Origin;
    }
    if (count == 1) {
      return this.First;
    }
    const idx = Math.floor(t);
    if (idx < 0) {
      return this.Get(0);
    }
    if (idx >= count - 1) {
      return this.Get(count - 1);
    }

    t -= idx;
    if (t <= 0.0) {
      return this.Get(idx);
    }
    if (t >= 1.0) {
      return this.Get(idx + 1);
    }

    const A = this.Get(idx);
    const B = this.Get(idx + 1);
    let s = 1.0 - t;
    return new Point3d(A.X == B.X ? A.X : s * A.X + t * B.X, A.Y == B.Y ? A.Y : s * A.Y + t * B.Y, A.Z == B.Z ? A.Z : s * A.Z + t * B.Z);
  }

  /**
   * Gets the line segment at the given index.
   * @param index Index of segment to retrieve, if it is not integer, it will be floored.
   * @returns Line segment at index or null on failure.
   */
  public SegmentAt(index: number): Line | null {
    if (index < 0) {
      return null;
    }
    if (index >= this.Count - 1) {
      return null;
    }
    index = Math.floor(index);
    return new Line(this.Get(index), this.Get(index + 1));
  }

  /**
   * Gets the unit tangent vector along the polyline at the given parameter.
   * The integer part of the parameter indicates the index of the segment.
   * @param t Polyline parameter.
   * @returns The tangent along the polyline at t.
   */
  public TangentAt(t: number): Vector3d {
    const count = this.Count;
    if (count < 2) {
      return Vector3d.Zero;
    }
    let segment_index = Math.floor(t);
    if (segment_index < 0) {
      segment_index = 0;
    } else if (segment_index >= count - 1) {
      segment_index = count - 2;
    }

    const tangent = this.Get(segment_index + 1).SubtractPoint(this.Get(segment_index));
    return tangent.Unitize();
  }

  /**
   * Constructs a polyline out of a parameter subdomain in this curve.
   * @param t0 The subdomain start of the polyline.
   * @param t1 The subdomain end of the polyline.
   * @remarks The integer part of the domain parameters indicate the index of the segment.
   * @returns The polyline as defined by the subdomain.
   */
  public Trim(t0: number, t1: number): Polyline {
    let count = this.Count;
    let N = count - 1;

    // Segment indices
    let si0 = Math.floor(t0);
    let si1 = Math.floor(t1);

    // Segment parameters
    let st0 = t0 - si0;
    let st1 = t1 - si1;
    if (st0 < 0.0) {
      st0 = 0.0;
    }
    if (st0 >= 1.0) {
      si0++;
      st0 = 0.0;
    }
    if (st1 < 0.0) {
      st1 = 0.0;
    }
    if (st1 >= 1.0) {
      si1++;
      st1 = 0.0;
    }

    // Limit to polyline domain.
    if (si0 < 0) {
      si0 = 0;
      st0 = 0.0;
    }
    if (si0 >= N) {
      si0 = N;
      st0 = 0.0;
    }
    if (si1 < 0) {
      si1 = 0;
      st1 = 0.0;
    }
    if (si1 >= N) {
      si1 = N;
      st1 = 0.0;
    }

    // Build trimmed polyline.
    const rc = Polyline.CreateFromPoints([this.PointAt(t0)]);
    for (let i = si0 + 1; i <= si1; i++) {
      rc.Add(this.Get(i));
    }
    if (st1 > 0.0) {
      rc.Add(this.PointAt(t1));
    }
    return rc;
  }

  /**
   * Gets the point on the polyline which is closest to a test-point.
   * @param testPoint Point to approximate.
   * @returns The point on the polyline closest to testPoint.
   */
  public ClosestPoint(testPoint: Point3d): Point3d {
    const t = this.ClosestParameter(testPoint);
    return this.PointAt(t);
  }

  /**
   * Gets the parameter along the polyline which is closest to a test-point.
   * @param testPoint Point to approximate.
   * @returns The parameter along the polyline closest to testPoint.
   */
  public ClosestParameter(testPoint: Point3d): number {
    const count = this.Count;
    if (count < 2) return 0.0;
    let sMin = 0.0;
    let tMin = 0.0;
    let dMin = Number.MAX_VALUE;

    for (let i = 0; i < count - 1; i++) {
      const seg = new Line(this.Get(i), this.Get(i + 1));
      let d, t;
      if (seg.Direction.IsTiny()) {
        t = 0.0;
        d = this.Get(i).DistanceTo(testPoint);
      } else {
        t = seg.ClosestParameter(testPoint);
        if (t <= 0.0) {
          t = 0.0;
        } else if (t > 1.0) {
          t = 1.0;
        }
        d = seg.PointAt(t).DistanceTo(testPoint);
      }

      if (d < dMin) {
        dMin = d;
        tMin = t;
        sMin = i;
      }
    }

    return sMin + tMin;
  }

  /**
   * Constructs an array of line segments that make up the entire polyline.
   * @returns An array of line segments or empty if the polyline contains fewer than 2 points.
   */
  public GetSegments(): Line[] {
    if (this.Count < 2) {
      return [];
    }
    const lines: Line[] = [];
    for (let i = 0; i < this.Count - 1; i++) {
      lines.push(new Line(this.Get(i), this.Get(i + 1)));
    }
    return lines;
  }

  /**
   * Retuens a new polyline which removed all points that are closer than tolerance to the previous point.
   * @remarks Start and end points are left intact.
   * @param tolerance Vertices closer together than tolerance will be removed.
   * @returns The new polyline
   */
  public DeleteShortSegments(tolerance: number = Open3d.EPSILON): Polyline {
    const count = this.Count;
    if (count < 3) {
      return Polyline.CreateFromPoints(this.items);
    }
    // Create an inclusion map
    const map = new Array<boolean>(count);
    // Always include the first and last point.
    map[0] = true;
    map[count - 1] = true;

    // Iterate over all internal points.
    let j = 0;
    for (let i = 1; i < count - 1; i++) {
      if (this.Get(i).DistanceTo(this.Get(j)) <= tolerance) {
        // The distance between this point and the last added point
        // is less than tolerance. We do not include it.
        map[i] = false;
      } else {
        // The distance between this point and the last added point
        // is more than the tolerance. Append this point to the clean list.
        j = i;
        map[i] = true;
      }
    }

    // Iterate backwards over the clean points, in an attempt to try and find
    // all the points too close to the end of the curve.
    for (let i = count - 2; i > 0; i--) {
      if (map[i]) {
        if (this.Get(i).DistanceTo(this.Get(count - 1)) <= tolerance) {
          // Point is too close to the end of the polyline, disable it.
          map[i] = false;
        } else {
          // Point is further than tolerance from the end of the polyline,
          // we can safely exhale.
          break;
        }
      }
    }

    // Create a new array of points
    const pts: Array<Point3d> = new Array<Point3d>(count);
    let N = 0;

    for (let i = 0; i < count; i++) {
      if (map[i]) {
        pts[N] = this.Get(i);
        N++;
      }
    }

    return Polyline.CreateFromPoints(pts);
  }

  /**
   * Smoothens the polyline segments by averaging adjacent vertices.
   * Smoothing requires a polyline with exclusively valid vertices.
   * @param amount Amount to smooth. Zero equals no smoothing, one equals complete smoothing.
   */
  public Smooth(amount: number): Polyline | null {
    const count = this.Count;
    if (count < 3) {
      return null;
    }

    let N = count - 1;
    amount *= 0.5;

    const v: Point3d[] = new Array<Point3d>(count);

    if (this.IsClosed) {
      // Closed polyline, smooth the end-points
      v[0] = Polyline.Smooth(this.Get(N - 1), this.Get(0), this.Get(1), amount);
      v[N] = v[0];
    } else {
      // Open polyline, copy the end points without smoothing.
      v[0] = this.Get(0);
      v[N] = this.Get(N);
    }

    // Iterate over the internal vertices
    for (let i = 1; i < N; i++) {
      v[i] = Polyline.Smooth(this.Get(i - 1), this.Get(i), this.Get(i + 1), amount);
    }

    return Polyline.CreateFromPoints(v);
  }

  /**
   * Check if the polyline is planar within the given tolerance.
   * @remarks The polyline must have at least 3 points. Or it is considered nonplanar.
   * @param tolerance
   * @returns true if the polyline is planar.
   */
  public IsPlanar(tolerance = Open3d.EPSILON): boolean {
    const count = this.Count;
    if (count < 3) {
      return false;
    }
    // create a plane from the first 3 points
    const plane = Plane.CreateFrom3Points(this.Get(0), this.Get(1), this.Get(2));
    for (let i = 3; i < count; i++) {
      if (!plane.IsPointCoplanar(this.Get(i), tolerance)) {
        return false;
      }
    }
    return true;
  }

  /**
   * Try get the plane of the polyline if it is planar.
   * @param tolerance
   * @returns the plane or null if the polyline is not planar.
   */
  public TryGetPlane(tolerance = Open3d.EPSILON): Plane | null {
    if (this.IsPlanar(tolerance)) {
      return Plane.CreateFrom3Points(this.Get(0), this.Get(1), this.Get(2));
    }
    return null;
  }

  /**
   * Try get the area of the polyline if it is planar and closed.
   * @param tolerance
   * @returns the area or null if the polyline is not planar.
   */
  public TryGetArea(tolerance = Open3d.EPSILON): number | null {
    if (this.IsPlanar() && this.IsClosed) {
      // orient the point to the plane
      const plane = this.TryGetPlane(tolerance)!;
      const polyline = this.Transform(Transform.PlaneToPlane(plane, Plane.PlaneXY));
      return Math.abs(Polyline.SignedPolygonArea(polyline));
    }
    return null;
  }

  /**
   * Checks if a point is on the polyline.
   * @param point the point to check.
   * @param tolerance
   * @returns true if the point is on the polyline.
   */
  public IsPointOn(point: Point3d, tolerance = Open3d.EPSILON): boolean {
    const count = this.Count;
    if (count < 2) {
      return false;
    }
    for (let i = 0; i < count - 1; i++) {
      const line = new Line(this.Get(i), this.Get(i + 1));
      if (line.IsPointOn(point, true, tolerance)) {
        return true;
      }
    }
    return false;
  }

  /**
   * It checks if a point is inside a Closed Planar polyline.
   * @remarks The polyline must be closed and planar. If not, it throws an exception.
   * @remarks if the point is on the polyline, it returns false.
   * @remarks If the point is not on the polyline plane, it returns false.
   * @remarks It performs the even-odd-rule Algorithm (a raycasting algorithm)
   * see https://en.wikipedia.org/wiki/Point_in_polygon
   * @param point the point to check.
   * @param tolerance
   * @returns true if the point is inside the polyline.
   */
  public IsPointInside(point: Point3d, tolerance = Open3d.EPSILON): boolean {
    if (!this.IsClosed) {
      throw new Error('Polyline is not closed.');
    }
    if (!this.IsPlanar(tolerance)) {
      throw new Error('Polyline is not planar.');
    }
    // if the point is on the polyline, return false
    if (this.IsPointOn(point, tolerance)) {
      return false;
    }

    const plane = this.TryGetPlane(tolerance)!;
    // if the point is not on the polyline plane, return false
    if (!plane.IsPointCoplanar(point, tolerance)) {
      return false;
    }

    // orient the point to the plane
    const orient = Transform.PlaneToPlane(plane, Plane.PlaneXY);
    const p = point.Transform(orient);
    const polyline = this.Transform(orient);
    // check if the point is inside the polyline in 2d
    return polyline.IsPointInside2D(p);
  }

  /**
   * It assumes the polyline is planar on the XY plane and checks if a point is inside the polyline.
   * @param point
   */
  private IsPointInside2D(point: Point3d): boolean {
    let count = this.Count;

    //A point is in a polygon if a line from the point to infinity crosses the polygon an odd number of times
    let inside = false;
    //For each edge (In this case for each point of the polygon and the previous one)
    for (let i = 0, j = count - 1; i < count; i++) {
      //If a line from the point into infinity crosses this edge
      if (
        this.Get(i).Y > point.Y !== this.Get(j).Y > point.Y && // One point needs to be above, one below our y coordinate
        // ...and the edge doesn't cross our Y corrdinate before our x coordinate (but between our x coordinate and infinity)
        point.X < ((this.Get(j).X - this.Get(i).X) * (point.Y - this.Get(i).Y)) / (this.Get(j).Y - this.Get(i).Y) + this.Get(i).X
      ) {
        // Invert odd
        inside = !inside;
      }
      j = i;
    }
    //If the number of crossings was odd, the point is in the polygon
    return inside;
  }

  /**
   * Transform the polyline using a Transformation matrix.
   * @param transformation Transformation matrix to apply.
   * @returns A new transformed polyline.
   */
  public Transform(transformation: Transform): Polyline {
    const newPoints = this.Map((p) => p.Transform(transformation));
    return Polyline.CreateFromPoints(newPoints);
  }

  //#endregion

  //#region Static methods

  /**
   * Initializes a new polyline from a collection of points.
   * @returns A new polyline.
   */
  public static CreateFromPoints(points: Point3d[]): Polyline {
    return new Polyline(points);
  }

  private static Smooth(v0: Point3d, v1: Point3d, v2: Point3d, amount: number) {
    const x = 0.5 * (v0.X + v2.X);
    const y = 0.5 * (v0.Y + v2.Y);
    const z = 0.5 * (v0.Z + v2.Z);

    const bx = x === v1.X ? x : v1.X + amount * (x - v1.X);
    const by = y === v1.Y ? y : v1.Y + amount * (y - v1.Y);
    const bz = z === v1.Z ? z : v1.Z + amount * (z - v1.Z);

    return new Point3d(bx, by, bz);
  }

  /**
   * This assumes the polyline is planar on the XY plane.
   * @param points
   */
  private static SignedPolygonArea(polyline: Polyline): number {
    // calculate area
    let area = 0;
    let count = polyline.Count;
    for (let i = 0; i < count; i++) {
      const p1 = polyline.Get(i);
      const p2 = polyline.Get((i + 1) % count);
      area += p1.X * p2.Y - p2.X * p1.Y;
    }
    return area * 0.5;
  }

  //#endregion
}

import { Line } from './Line';
import { Open3d } from './Open3d';
import { Open3dMath } from './Open3dMath';
import { Plane } from './Plane';
import { Point3d } from './Point3d';

/**
 * Provides static methods for the computation of intersections, projections, sections and similar.
 */
export class Intersection {
  private constructor() {
    throw new Error('Cannot initialize an intersection instance.');
  }

  static unsafeTParametersOpen3d(line1: Line, line2: Line): [number, number] {
    const n0 = line1.Direction.CrossProduct(line2.Direction);
    const n1 = line1.Direction.CrossProduct(n0);
    const n2 = line2.Direction.CrossProduct(n0);

    let t1 = line2.From.SubtractPoint(line1.From).DotProduct(n2) / line1.Direction.DotProduct(n2);
    let t2 = line1.From.SubtractPoint(line2.From).DotProduct(n1) / line2.Direction.DotProduct(n1);

    return [t1, t2];
  }

  public static unsafeTParametersRaw(line1: Line, line2: Line): [number, number] {
    const p1 = line1.From;
    const p2 = line1.To;
    const p3 = line2.From;
    const p4 = line2.To;

    const p13 = p1.SubtractPoint(p3);
    const p43 = p4.SubtractPoint(p3);
    const p21 = p2.SubtractPoint(p1);

    const d1343 = p13.X * p43.X + p13.Y * p43.Y + p13.Z * p43.Z;
    const d4321 = p43.X * p21.X + p43.Y * p21.Y + p43.Z * p21.Z;
    const d1321 = p13.X * p21.X + p13.Y * p21.Y + p13.Z * p21.Z;
    const d4343 = p43.X * p43.X + p43.Y * p43.Y + p43.Z * p43.Z;
    const d2121 = p21.X * p21.X + p21.Y * p21.Y + p21.Z * p21.Z;

    const denom = d2121 * d4343 - d4321 * d4321;
    const numer = d1343 * d4321 - d1321 * d4343;

    const mua = numer / denom;
    const mub = (d1343 + d4321 * mua) / d4343;

    return [mua, mub];
  }

  public static LineLineTParameters(line1: Line, line2: Line): [number, number] | null {
    if (line1.Direction.IsParallelTo(line2.Direction) !== Open3d.ParallelIndicator.Parallel) return null;
    if (!line1.IsValid) return [0, Line.LinePointClosestParameter(line2, line1.From)];
    if (!line2.IsValid) return [Line.LinePointClosestParameter(line1, line2.From), 0];

    const n0 = line1.Direction.CrossProduct(line2.Direction);
    const n1 = line1.Direction.CrossProduct(n0);
    const n2 = line2.Direction.CrossProduct(n0);

    let t1 = line2.From.SubtractPoint(line1.From).DotProduct(n2) / line1.Direction.DotProduct(n2);
    let t2 = line1.From.SubtractPoint(line2.From).DotProduct(n1) / line2.Direction.DotProduct(n1);

    return [t1, t2];
  }

  public static LineLineCrossing(
    firstLine: Line,
    secondLine: Line,
    limitFirstToFinite: boolean = false,
    limitSecondToFinite: boolean = false
  ): [Point3d, Point3d] | null {
    const result = Intersection.LineLineTParameters(firstLine, secondLine);
    if (!result) return null;
    const [t1, t2] = result;

    if (limitFirstToFinite && limitSecondToFinite) {
      if (t1 >= 0 && t1 <= 1 && t2 >= 0 && t2 <= 1) return [firstLine.PointAt(t1), secondLine.PointAt(t2)];
      const t0A = Line.LinePointClosestParameter(firstLine, secondLine.From);
      const t0B = Line.LinePointClosestParameter(firstLine, secondLine.To);
      const t1A = Line.LinePointClosestParameter(secondLine, firstLine.From);
      const t1B = Line.LinePointClosestParameter(secondLine, firstLine.To);

      const validPairs: Line[] = [];
      if (t0A >= 0 && t0A <= 1) validPairs.push(new Line(firstLine.PointAt(t0A), secondLine.From));
      if (t0B >= 0 && t0B <= 1) validPairs.push(new Line(firstLine.PointAt(t0B), secondLine.To));
      if (t1A >= 0 && t1A <= 1) validPairs.push(new Line(firstLine.From, secondLine.PointAt(t1A)));
      if (t1B >= 0 && t1B <= 1) validPairs.push(new Line(firstLine.To, secondLine.PointAt(t1B)));

      if (validPairs.length === 0) {
        validPairs.push(new Line(firstLine.From, secondLine.From));
        validPairs.push(new Line(firstLine.From, secondLine.To));
        validPairs.push(new Line(firstLine.To, secondLine.From));
        validPairs.push(new Line(firstLine.To, secondLine.To));
      }

      const shortestLine = validPairs.sort((a, b) => a.Length - b.Length)[0];
      return [shortestLine.From, shortestLine.To];
    } else if (limitSecondToFinite) {
      if (t2 >= 0 && t2 <= 1) return [firstLine.PointAt(t1), secondLine.PointAt(t2)];
      const p2A = secondLine.PointAt(Line.LinePointClosestParameter(firstLine, secondLine.From));
      const p2B = secondLine.PointAt(Line.LinePointClosestParameter(firstLine, secondLine.To));
      if (p2A.DistanceTo(secondLine.From) < p2B.DistanceTo(secondLine.To)) return [p2A, secondLine.From];
      return [p2B, secondLine.To];
    } else if (limitFirstToFinite) {
      if (t1 >= 0 && t1 <= 1) return [firstLine.PointAt(t1), secondLine.PointAt(t2)];
      const p1A = firstLine.PointAt(Line.LinePointClosestParameter(secondLine, firstLine.From));
      const p1B = firstLine.PointAt(Line.LinePointClosestParameter(secondLine, firstLine.To));
      if (p1A.DistanceTo(firstLine.From) < p1B.DistanceTo(firstLine.To)) return [firstLine.From, p1A];
      return [firstLine.To, p1B];
    }

    return [firstLine.PointAt(t1), secondLine.PointAt(t2)];
  }

  public static LineLineDistance(firstLine: Line, secondLine: Line, limitFirstToFinite: boolean = false, limitSecondToFinite: boolean = false): number | null {
    const result = Intersection.LineLineCrossing(firstLine, secondLine, limitFirstToFinite, limitSecondToFinite);
    if (!result) return null;
    return result[0].DistanceTo(result[1]);
  }

  public static LineLineIntersectionCrossing(
    firstLine: Line,
    secondLine: Line,
    limitFirstToFinite: boolean = false,
    limitSecondToFinite: boolean = false,
    tolerance: number = Open3d.EPSILON
  ): Point3d | null {
    const result = Intersection.LineLineCrossing(firstLine, secondLine, limitFirstToFinite, limitSecondToFinite);
    if (!result) return null;
    return result[0].DistanceTo(result[1]) < tolerance ? result[0] : null;
  }

  /**
   * Try to get an intersection point between this line and another line.
   * If there's no intersection, null is returned.
   * @param firstLine first Line Line to intersect with.
   * @param secondLine second Line to intersect with.
   * @param limitToFiniteSegment If true, the distance is limited to the finite line segment. default: false
   * @param tolerance Tolerance used to determine if the lines are intersecting, default: Open3d.EPSILON
   * @returns The intersection point, or null if there's no intersection.
   */
  public static LineLine(firstLine: Line, secondLine: Line, limitToFiniteSegment: boolean = false, tolerance: number = Open3d.EPSILON): Point3d | null {
    // http://paulbourke.net/geometry/pointlineplane/
    if (!firstLine.IsValid || !secondLine.IsValid) return null;
    const p1 = firstLine.From;
    const p2 = firstLine.To;
    const p3 = secondLine.From;
    const p4 = secondLine.To;

    const p13 = p1.SubtractPoint(p3);
    const p43 = p4.SubtractPoint(p3);
    const p21 = p2.SubtractPoint(p1);

    const d1343 = p13.X * p43.X + p13.Y * p43.Y + p13.Z * p43.Z;
    const d4321 = p43.X * p21.X + p43.Y * p21.Y + p43.Z * p21.Z;
    const d1321 = p13.X * p21.X + p13.Y * p21.Y + p13.Z * p21.Z;
    const d4343 = p43.X * p43.X + p43.Y * p43.Y + p43.Z * p43.Z;
    const d2121 = p21.X * p21.X + p21.Y * p21.Y + p21.Z * p21.Z;

    const denom = d2121 * d4343 - d4321 * d4321;
    if (Open3dMath.EpsilonEquals(denom, 0)) {
      return null;
    }
    const numer = d1343 * d4321 - d1321 * d4343;

    const mua = numer / denom;
    const mub = (d1343 + d4321 * mua) / d4343;

    const pointA = new Point3d(p1.X + mua * p21.X, p1.Y + mua * p21.Y, p1.Z + mua * p21.Z);
    const pointB = new Point3d(p3.X + mub * p43.X, p3.Y + mub * p43.Y, p3.Z + mub * p43.Z);

    const distance = pointA.DistanceTo(pointB);

    if (distance > tolerance) return null;

    const intersecPt = pointA.AddPoint(pointB).Divide(2);

    if (!limitToFiniteSegment) return intersecPt;

    const paramA = firstLine.ClosestParameter(intersecPt, false);
    const paramB = secondLine.ClosestParameter(intersecPt, false);

    if (paramA >= 0 && paramA <= 1 && paramB >= 0 && paramB <= 1) return intersecPt;

    return null;
  }

  /**
   * Intersects a line and a plane. This function only returns a single intersection point or null (i.e. if the line is coincident with the plane then no intersection is assumed).
   * @param line The line to intersect with.
   * @param plane The plane to intersect with.
   * @param limitToFiniteSegment If true, the intersection is limited to the finite line segment. default: false
   * @returns The intersection point.
   */
  public static LinePlane(line: Line, plane: Plane, limitToFiniteSegment: boolean = false): Point3d | null {
    const diff = line.From.SubtractPoint(plane.Origin);
    const projectLine = diff.DotProduct(plane.Normal);
    const projectNormal = line.UnitDirection.DotProduct(plane.Normal);

    // if line is parallel to plane
    if (Open3dMath.EpsilonEquals(projectNormal, 0)) return null;

    const projectLength = -projectLine / projectNormal;

    // if limitToFiniteSegment is true, we check if the intersection is within the finite line segment
    if (limitToFiniteSegment) {
      if (projectLength < 0 || projectLength > line.Length) return null;
    }

    return line.From.Add(line.UnitDirection.Multiply(projectLength));
  }

  /**
   * Intersects two planes and return the intersection line. If the planes are parallel or coincident, no intersection is assumed.
   * @param planeA First plane for intersection.
   * @param planeB Second plane for intersection.
   * @returns The intersection line or null.
   */
  public static PlanePlane(planeA: Plane, planeB: Plane): Line | null {
    if (planeA.Normal.IsParallelTo(planeB.Normal)) return null;

    const normal = planeB.Normal.CrossProduct(planeA.Normal);
    const origin = planeA.Origin.AddPoint(planeB.Origin).Multiply(0.5);
    const planeC = Plane.CreateFromNormal(origin, normal);

    const pt = Intersection.PlanePlanePlane(planeA, planeB, planeC);

    if (pt == null) return null;

    return new Line(pt, pt.Add(planeC.Normal));
  }

  /**
   * Intersects three planes to find the single point they all share.
   * @param planeA First plane for intersection.
   * @param planeB Second plane for intersection.
   * @param planeC Third plane for intersection.
   * @returns The intersection point or null.
   */
  public static PlanePlanePlane(planeA: Plane, planeB: Plane, planeC: Plane): Point3d | null {
    // see https://www.mathsisfun.com/algebra/systems-linear-equations-matrices.html for solving a system of linear equations

    const ea = planeA.Equation;
    const eb = planeB.Equation;
    const ec = planeC.Equation;
    const mA = [ea[0], ea[1], ea[2], eb[0], eb[1], eb[2], ec[0], ec[1], ec[2]];
    const mB = [-ea[3], -eb[3], -ec[3]];

    // ma*V = mb => V = (ma)^-1 * mb

    const [a11, a12, a13, a21, a22, a23, a31, a32, a33] = mA;

    const det = a11 * (a22 * a33 - a23 * a32) - a12 * (a21 * a33 - a23 * a31) + a13 * (a21 * a32 - a22 * a31);

    if (Open3dMath.EpsilonEquals(det, 0)) return null;

    const invDet = 1 / det;

    const v11 = invDet * (a22 * a33 - a23 * a32);
    const v12 = invDet * (a13 * a32 - a12 * a33);
    const v13 = invDet * (a12 * a23 - a13 * a22);

    const v21 = invDet * (a23 * a31 - a21 * a33);
    const v22 = invDet * (a11 * a33 - a13 * a31);
    const v23 = invDet * (a13 * a21 - a11 * a23);

    const v31 = invDet * (a21 * a32 - a22 * a31);
    const v32 = invDet * (a12 * a31 - a11 * a32);
    const v33 = invDet * (a11 * a22 - a12 * a21);

    const vX = v11 * mB[0] + v12 * mB[1] + v13 * mB[2];
    const vY = v21 * mB[0] + v22 * mB[1] + v23 * mB[2];
    const vZ = v31 * mB[0] + v32 * mB[1] + v33 * mB[2];

    return new Point3d(vX, vY, vZ);
  }
}

import { Line } from './Line';
import { Open3d } from './Open3d';
import { Plane } from './Plane';
import { Vector3d } from './Vector3d';

/**
 * Provides static methods for the computation of intersections, projections, sections and similar.
 */
export class Intersection {
  private constructor() {
    throw new Error('Cannot initialize an intersection instance.');
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
  public static LineLine(
    firstLine: Line,
    secondLine: Line,
    limitToFiniteSegment: boolean = false,
    tolerance: number = Open3d.EPSILON
  ): Vector3d | null {
    // http://paulbourke.net/geometry/pointlineplane/
    if (!firstLine.IsValid || !secondLine.IsValid) return null;
    const p1 = firstLine.From;
    const p2 = firstLine.To;
    const p3 = secondLine.From;
    const p4 = secondLine.To;

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

    const distance = pointA.DistanceTo(pointB);

    if (distance > tolerance) return null;

    const intersecPt = pointA.Add(pointB).Divide(2);

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
  public static LinePlane(line: Line, plane: Plane, limitToFiniteSegment: boolean = false): Vector3d | null {
    const diff = line.From.Subtract(plane.Origin);
    const projectLine = diff.DotProduct(plane.Normal);
    const projectNormal = line.UnitDirection.DotProduct(plane.Normal);

    // if line is parallel to plane
    if (Open3d.equals(projectNormal, 0)) return null;

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
    const origin = planeA.Origin.Add(planeB.Origin).Multiply(0.5);
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
  public static PlanePlanePlane(planeA: Plane, planeB: Plane, planeC: Plane): Vector3d | null {
    // see https://www.mathsisfun.com/algebra/systems-linear-equations-matrices.html for solving a system of linear equations

    const ea = planeA.Equation;
    const eb = planeB.Equation;
    const ec = planeC.Equation;
    const mA = [ea[0], ea[1], ea[2], eb[0], eb[1], eb[2], ec[0], ec[1], ec[2]];
    const mB = [-ea[3], -eb[3], -ec[3]];

    // ma*V = mb => V = (ma)^-1 * mb

    const [a11, a12, a13, a21, a22, a23, a31, a32, a33] = mA;

    const det = a11 * (a22 * a33 - a23 * a32) - a12 * (a21 * a33 - a23 * a31) + a13 * (a21 * a32 - a22 * a31);

    if (Open3d.equals(det, 0)) return null;

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

    return new Vector3d(vX, vY, vZ);
  }
}

import { IntersectionEvent } from './intersectionEvent';
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

  static LineLineTParameters(line1: Line, line2: Line): [number, number] | null {
    // http://paulbourke.net/geometry/pointlineplane/
    const p13 = line1.From.SubtractPoint(line2.From);
    const p43 = line2.Direction;
    const p21 = line1.Direction;

    const d1343 = p13.DotProduct(p43);
    const d4321 = p43.DotProduct(p21);
    const d1321 = p13.DotProduct(p21);
    const d4343 = p43.DotProduct(p43);
    const d2121 = p21.DotProduct(p21);

    const denom = d2121 * d4343 - d4321 * d4321;
    const numer = d1343 * d4321 - d1321 * d4343;

    if (Open3dMath.EpsilonEquals(denom, 0)) {
      return null;
    }

    const mua = numer / denom;
    const mub = (d1343 + d4321 * mua) / d4343;

    return [mua, mub];
  }

  /**
   * Try to get an intersection point between this line and another line.
   * If there's no intersection, null is returned.
   * @param firstLine first Line Line to intersect with.
   * @param secondLine second Line to intersect with.
   * @param limitToFiniteSegment If true, the distance is limited to the finite line segment. default: false
   * @param distance (default is global tolerance) Distance between two lines to filter intersections. To include crossing lines, increase the distance 
   * @returns The point at the intersetion, or null if there's no intersection.
   */
  public static LineLine(firstLine: Line, secondLine: Line, limitToFiniteSegment: boolean = false, distance: number = Open3d.EPSILON): Point3d | null {
    const crossing = Intersection.CrossingLineLine(firstLine, secondLine, limitToFiniteSegment, distance);
    if (crossing) return crossing.PointA.AddPoint(crossing.PointB).Multiply(.5);
    return null;
  }

  /**
   * Try to closest points between two lines.
   * If there's no valid crossing, null is returned.
   * @param firstLine first Line Line to intersect with.
   * @param secondLine second Line to intersect with.
   * @param limitToFiniteSegment If true, the distance is limited to the finite line segment. default: false
   * @param distance (default is Infinity) Distance between two lines to filter intersections. To include crossing lines, increase the distance 
   * @returns The intersection event, or null if there's no intersection.
   */
   public static CrossingLineLine(firstLine: Line, secondLine: Line, limitToFiniteSegment: boolean = false, distance: number = Infinity): IntersectionEvent | null {
    // http://paulbourke.net/geometry/pointlineplane/
    if (!firstLine.IsValid || !secondLine.IsValid) return null;
    const tParameters = Intersection.LineLineTParameters(firstLine, secondLine);
    if (!tParameters) return null;

    const [mua, mub] = tParameters;

    const pointA = firstLine.PointAt(mua);
    const pointB = secondLine.PointAt(mub);

    const d = pointA.DistanceTo(pointB);

    if (limitToFiniteSegment && (mua < 0 || mua > 1 || mub < 0 || mub > 1)) return null
    // if it's a pure intersection, return the point
    if (d > distance) return null;
    // otherwise return an intersection event    
    return new IntersectionEvent(mua, mub, pointA, pointB);
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

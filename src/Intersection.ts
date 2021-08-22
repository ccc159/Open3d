import { Line } from './Line';
import { Open3d } from './Open3d';
import { Transform } from './Transform';
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
  public static LineLineIntersection(
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
}

/**
 * +1 = both vectors are parallel.
 *  0 = vectors are not parallel or at least one of the vectors is zero.
 * -1 = vectors are anti-parallel.
 */
export enum ParallelIndicator {
  Parallel = 1,
  NotParallel = 0,
  AntiParallel = -1,
}

export class Open3d {
  /**
   * The default number epsilon used in floating point comparisons.
   */
  public static EPSILON: number = 1e-6;

  /**
   * The default angle epsilon.
   */
  public static ANGLE_EPSILON: number = 0.001;

  /**
   * the function to compare if two floating point numbers are equal.
   */
  public static equals(a: number, b: number): boolean {
    return Math.abs(a - b) < Open3d.EPSILON;
  }

  /**
   * the function to compare if two angles are equal.
   */
  public static angleEquals(a: number, b: number): boolean {
    return Math.abs(a - b) < Open3d.ANGLE_EPSILON;
  }
}

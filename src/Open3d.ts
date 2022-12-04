/* eslint-disable @typescript-eslint/no-namespace */
export namespace Open3d {
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

  /**
   * The default number epsilon used in floating point comparisons.
   */
  export const EPSILON = 1e-6;

  /**
   * The default angle epsilon.
   */
  export const ANGLE_EPSILON = 0.001;
}

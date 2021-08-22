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
  export const EPSILON: number = 1e-6;

  /**
   * The default angle epsilon.
   */
  export const ANGLE_EPSILON: number = 0.001;

  /**
   * the function to compare if two floating point numbers are equal.
   */
  export const equals = (a: number, b: number): boolean => {
    return Math.abs(a - b) < Open3d.EPSILON;
  };

  /**
   * the function to compare if two angles are equal.
   */
  export const angleEquals = (a: number, b: number): boolean => {
    return Math.abs(a - b) < Open3d.ANGLE_EPSILON;
  };

  /**
   * clamp a value between min and max.
   * @param value the value to clamp.
   * @param min the minimum value.
   * @param max the maximum value.
   * @return the clamped value.
   */
  export const clamp = (value: number, min: number, max: number): number => {
    return Math.max(min, Math.min(max, value));
  };
}

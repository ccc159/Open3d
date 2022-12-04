import { Open3d } from "./Open3d";

/**
 * Provides constants and static methods that are additional to Math.
 */
export class Open3dMath {
  /**
   * Limits a number to be specified within an interval of two numbers, by specifying a fixed minimum and maximum.
   * @param value A number.
   * @param min A first bound.
   * @param max A second bound. This does not necessarily need to be larger or smaller than bound1.
   * @returns The clamped value.
   */
  public static Clamp(value: number, min: number, max: number): number {
    // swap min and max if min is larger than max
    if (min > max) {
      const temp = min;
      min = max;
      max = temp;
    }
    return Math.min(Math.max(value, min), max);
  }

  /**
   * Convert an angle from radians to degrees.
   * @param radians Radians to convert (180 degrees equals pi radians).
   * @returns degrees
   */
  public static ToDegrees(radians: number): number {
    return (radians * 180) / Math.PI;
  }

  /**
   * Convert an angle from degrees to radians.
   * @param degrees Degrees to convert (180 degrees equals pi radians).
   * @returns radians
   * @example Open3dMath.ToRadians(180) // returns pi
   */
  public static ToRadians(degrees: number): number {
    return (degrees * Math.PI) / 180;
  }

  /**
   * the function to compare if two floating point numbers are equal.
   */
  public static EpsilonEquals = (
    a: number,
    b: number,
    epsilon = Open3d.EPSILON
  ): boolean => {
    return Math.abs(a - b) < epsilon;
  };
}

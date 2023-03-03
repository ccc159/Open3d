/**
 * Provides constants and static methods that are additional to Math.
 */
export declare class Open3dMath {
    /**
     * Limits a number to be specified within an interval of two numbers, by specifying a fixed minimum and maximum.
     * @param value A number.
     * @param min A first bound.
     * @param max A second bound. This does not necessarily need to be larger or smaller than bound1.
     * @returns The clamped value.
     */
    static Clamp(value: number, min: number, max: number): number;
    /**
     * Convert an angle from radians to degrees.
     * @param radians Radians to convert (180 degrees equals pi radians).
     * @returns degrees
     */
    static ToDegrees(radians: number): number;
    /**
     * Convert an angle from degrees to radians.
     * @param degrees Degrees to convert (180 degrees equals pi radians).
     * @returns radians
     * @example Open3dMath.ToRadians(180) // returns pi
     */
    static ToRadians(degrees: number): number;
    /**
     * the function to compare if two floating point numbers are equal.
     */
    static EpsilonEquals: (a: number, b: number, epsilon?: number) => boolean;
}

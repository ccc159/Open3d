export declare namespace Open3d {
    /**
     * +1 = both vectors are parallel.
     *  0 = vectors are not parallel or at least one of the vectors is zero.
     * -1 = vectors are anti-parallel.
     */
    enum ParallelIndicator {
        Parallel = 1,
        NotParallel = 0,
        AntiParallel = -1
    }
    /**
     * The default number epsilon used in floating point comparisons.
     */
    const EPSILON: number;
    /**
     * The default angle epsilon.
     */
    const ANGLE_EPSILON: number;
    /**
     * the function to compare if two floating point numbers are equal.
     */
    const equals: (a: number, b: number) => boolean;
    /**
     * the function to compare if two angles are equal.
     */
    const angleEquals: (a: number, b: number) => boolean;
    /**
     * clamp a value between min and max.
     * @param value the value to clamp.
     * @param min the minimum value.
     * @param max the maximum value.
     * @return the clamped value.
     */
    const clamp: (value: number, min: number, max: number) => number;
}

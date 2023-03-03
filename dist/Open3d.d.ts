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
}

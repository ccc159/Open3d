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

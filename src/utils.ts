import { TOLERANCE } from './constants';

/**
 * determins if a number equals to the other under the tolerance.
 * @param a a number
 * @param b another number
 */
export function NumberEqual(a: number, b: number) {
  return Math.abs(a - b) < TOLERANCE;
}

/**
 * determins if a number equals to 0 under the tolerance.
 * @param a a number
 */
export function NumberZero(a: number) {
  return NumberEqual(a, 0);
}

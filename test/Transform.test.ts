import { ParallelIndicator } from '../src/Open3d';
import { Transform } from '../src/Transform';

let t1: Transform;
let t2: Transform;
let t3: Transform;

// calculations compared with result in https://ncalculators.com/matrix/4x4-matrix-multiplication-calculator.htm

beforeEach(() => {
  t1 = new Transform([5, 7, 9, 10, 2, 3, 3, 8, 8, 10, 2, 3, 3, 3, 4, 8]);
  t2 = new Transform([3, 10, 12, 18, 12, 1, 4, 9, 9, 10, 12, 2, 3, 12, 4, 10]);
  t3 = new Transform([1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13, 14, 15, 16]);
});

test('M and ToArray', () => {
  expect(t1.M).toStrictEqual([5, 7, 9, 10, 2, 3, 3, 8, 8, 10, 2, 3, 3, 3, 4, 8]);
  expect(t2.ToArray()).toStrictEqual([3, 10, 12, 18, 12, 1, 4, 9, 9, 10, 12, 2, 3, 12, 4, 10]);
  expect(t3).toStrictEqual(new Transform([1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13, 14, 15, 16]));
});

test('Determinant', () => {
  expect(t1.Determinant).toBe(-361);
  expect(t3.Determinant).toBe(0);
});

test('Inverse', () => {
  expect(t1.TryGetInverse()).toMatchObject(
    new Transform([
      -71 / 361,
      -271 / 361,
      26 / 361,
      350 / 361,
      51 / 361,
      215 / 361,
      22 / 361,
      -287 / 361,
      71 / 361,
      -90 / 361,
      -26 / 361,
      11 / 361,
      -28 / 361,
      66 / 361,
      -5 / 361,
      16 / 361,
    ])
  );

  expect(t3.TryGetInverse()).toBeNull();
});

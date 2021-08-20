import { ParallelIndicator } from '../src/Open3d';
import { Transform } from '../src/Transform';
import { Vector3d } from '../src/Vector3d';

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

test('Equals', () => {
  expect(t1.Equals(t2)).toBe(false);
  expect(t2.Equals(t2)).toBe(true);
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

test('Translation', () => {
  expect(Transform.Translation(new Vector3d(2.2, 1, 5.5))).toMatchObject(new Transform([1, 0, 0, 2.2, 0, 1, 0, 1, 0, 0, 1, 5.5, 0, 0, 0, 1]));
});

test('Scale', () => {
  const pt = new Vector3d(1, 2, 3);
  expect(Transform.Scale(pt, 2.5)).toMatchObject(new Transform([2.5, 0, 0, -1.5, 0, 2.5, 0, -3, 0, 0, 2.5, -4.5, 0, 0, 0, 1]));
});

test('Rotation', () => {
  const pt = new Vector3d(1, 2, 3);
  expect(
    Transform.Rotation(Math.PI / 3, pt, pt).Equals(
      new Transform([
        0.535714285714286, -0.622936503400842, 0.570052907029133, 0, 0.765793646257985, 0.642857142857143, -0.0171693106574236, 0, -0.355767192743419,
        0.445740739228852, 0.821428571428572, 0, 0, 0, 0, 1,
      ])
    )
  ).toBe(true);
});

test('RotationZYX', () => {
  console.log(Transform.RotationZYX(Math.PI / 4, Math.PI / 3, Math.PI / 2));
  expect(
    Transform.RotationZYX(Math.PI / 4, Math.PI / 3, Math.PI / 2).Equals(
      new Transform([
        0.353553390593274, 0.612372435695795, 0.707106781186548, 0, 0.353553390593274, 0.612372435695795, -0.707106781186548, 0, -0.866025403784439,
        0.5, 0, 0, 0, 0, 0, 1,
      ])
    )
  ).toBe(true);
});

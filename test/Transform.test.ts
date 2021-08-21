import { Plane } from '../src/Plane';
import { Transform } from '../src/Transform';
import { Vector3d } from '../src/Vector3d';

let t1: Transform;
let t2: Transform;
let t3: Transform;

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

test('Identity', () => {
  expect(Transform.Identity.M).toStrictEqual([1, 0, 0, 0, 0, 1, 0, 0, 0, 0, 1, 0, 0, 0, 0, 1]);
});

test('IsIdentity', () => {
  expect(t1.IsIdentity).toBe(false);
  expect(Transform.Identity.IsIdentity).toBe(true);
});

test('ZeroTransformation', () => {
  expect(Transform.ZeroTransformation.M).toStrictEqual([0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 1]);
});

test('IsZeroTransformation', () => {
  expect(t1.IsZeroTransformation).toBe(false);
  expect(Transform.ZeroTransformation.IsZeroTransformation).toBe(true);
});

test('Clone', () => {
  expect(t1.Clone().Equals(t1)).toBe(true);
  expect(t3.Clone()).toStrictEqual(new Transform([1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13, 14, 15, 16]));
});

test('Determinant', () => {
  expect(t1.Determinant).toBe(-361);
  expect(t3.Determinant).toBe(0);
});

test('MultiplyMatrix', () => {
  expect(t1.MultiplyMatrix(t2).Equals(new Transform([210, 267, 236, 271, 93, 149, 104, 149, 171, 146, 172, 268, 105, 169, 128, 169]))).toBe(true);
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
  expect(
    Transform.RotationZYX(Math.PI / 4, Math.PI / 3, Math.PI / 2).Equals(
      new Transform([
        0.353553390593274, 0.612372435695795, 0.707106781186548, 0, 0.353553390593274, 0.612372435695795, -0.707106781186548, 0, -0.866025403784439,
        0.5, 0, 0, 0, 0, 0, 1,
      ])
    )
  ).toBe(true);
});

test('PlanarProjection', () => {
  const v1 = new Vector3d(8.66, 2.5, -4.33);
  const v2 = new Vector3d(0, 8.66, 5);
  const plane = new Plane(Vector3d.Zero, v1, v2);
  expect(
    Transform.PlanarProjection(plane).Equals(
      new Transform([
        0.749997249848742, 0.216511908154949, -0.374998624924371, 0, 0.216511908154949, 0.812492437205051, 0.324763098760851, 0, -0.374998624924371,
        0.324763098760851, 0.437510312946207, 0, 0, 0, 0, 1,
      ])
    )
  ).toBe(true);
});

test('Mirror', () => {
  const v1 = new Vector3d(8.66, 2.5, -4.33);
  const v2 = new Vector3d(0, 8.66, 5);
  const plane = new Plane(Vector3d.Zero, v1, v2);

  expect(
    Transform.Mirror(plane).Equals(
      new Transform([
        0.499994499697483, 0.433023816309897, -0.749997249848742, 0, 0.433023816309897, 0.624984874410103, 0.649526197521701, 0, -0.749997249848742,
        0.649526197521701, -0.124979374107587, 0, 0, 0, 0, 1,
      ])
    )
  ).toBe(true);
});

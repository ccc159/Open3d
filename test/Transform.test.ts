import { Plane } from '../src/Plane';
import { Point3d } from '../src/Point3d';
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

test('MultiplyScalar', () => {
  expect(t1.MultiplyScalar(3).Equals(new Transform([15, 21, 27, 30, 6, 9, 9, 24, 24, 30, 6, 9, 9, 9, 12, 24]))).toBe(true);
});

test('Transpose', () => {
  expect(t1.Transpose().Equals(new Transform([5, 2, 8, 3, 7, 3, 10, 3, 9, 3, 2, 4, 10, 8, 3, 8]))).toBe(true);
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
  const pt = new Point3d(1, 2, 3);
  expect(Transform.Scale(pt, 2.5)).toMatchObject(new Transform([2.5, 0, 0, -1.5, 0, 2.5, 0, -3, 0, 0, 2.5, -4.5, 0, 0, 0, 1]));
});

test('Rotation', () => {
  const pt = new Vector3d(1, 2, 3);
  const center = new Point3d(1, 2, 3);
  expect(
    Transform.Rotation(Math.PI / 3, pt, center).Equals(
      new Transform([
        0.535714285714286, -0.622936503400842, 0.570052907029133, 0, 0.765793646257985, 0.642857142857143, -0.0171693106574236, 0, -0.355767192743419, 0.445740739228852,
        0.821428571428572, 0, 0, 0, 0, 1,
      ])
    )
  ).toBe(true);
});

test('RotationZYX', () => {
  expect(
    Transform.RotationZYX(Math.PI / 4, Math.PI / 3, Math.PI / 2).Equals(
      new Transform([
        0.353553390593274, 0.612372435695795, 0.707106781186548, 0, 0.353553390593274, 0.612372435695795, -0.707106781186548, 0, -0.866025403784439, 0.5, 0, 0, 0, 0, 0, 1,
      ])
    )
  ).toBe(true);
});

test('PlanarProjection', () => {
  const v1 = new Vector3d(8.66, 2.5, -4.33);
  const v2 = new Vector3d(0, 8.66, 5);
  const plane = new Plane(Point3d.Origin, v1, v2);
  expect(
    Transform.PlanarProjection(plane).Equals(
      new Transform([
        0.749997249848742, 0.216511908154949, -0.374998624924371, 0, 0.216511908154949, 0.812492437205051, 0.324763098760851, 0, -0.374998624924371, 0.324763098760851,
        0.437510312946207, 0, 0, 0, 0, 1,
      ])
    )
  ).toBe(true);
});

test('Mirror', () => {
  const v1 = new Vector3d(8.66, 2.5, -4.33);
  const v2 = new Vector3d(0, 8.66, 5);
  const plane = new Plane(Point3d.Origin, v1, v2);

  expect(
    Transform.Mirror(plane).Equals(
      new Transform([
        0.499994499697483, 0.433023816309897, -0.749997249848742, 0, 0.433023816309897, 0.624984874410103, 0.649526197521701, 0, -0.749997249848742, 0.649526197521701,
        -0.124979374107587, 0, 0, 0, 0, 1,
      ])
    )
  ).toBe(true);
});

test('VectorToVector', () => {
  const v1 = new Vector3d(1, 2, 3);
  const v2 = new Vector3d(5, 8, 2);

  expect(
    Transform.VectorToVector(v1, v2).Equals(
      new Transform([
        0.9239977166542427, -0.05879568524972252, 0.37785087933437617, 0, -0.16965048434446112, 0.8225148990075958, 0.5428516869939839, 0, -0.3427053147814248, -0.5656963039534022,
        0.7500271721171337, 0, 0, 0, 0, 1,
      ])
    )
  ).toBe(true);
});

test('PlaneToPlane', () => {
  let v1 = new Vector3d(1, 2, 3);
  let v2 = new Vector3d(5, 8, 2);
  let p1 = new Plane(Point3d.Origin, v1, v2);

  let v3 = new Vector3d(-2, 2, 7);
  let v4 = new Vector3d(0, -3, -5);
  let p2 = new Plane(new Point3d(3, 1, -3), v3, v4);

  expect(
    Transform.PlaneToPlane(p1, p2).Equals(
      new Transform([
        -0.9693598382713079, -0.20768534113133943, 0.13118042165576027, 3, 0.23894604552133986, -0.6733489512835822, 0.6996470375375099, 1, -0.05697623431166421,
        0.7095547821588263, 0.7023430214924924, -3, 0, 0, 0, 1,
      ])
    )
  ).toBe(true);

  let c1 = new Point3d(1, 2, 3);
  v1 = new Vector3d(1, 2, 3);
  v2 = new Vector3d(5, 8, 2);
  p1 = new Plane(c1, v2, v1);

  let c2 = new Point3d(-2, 2, 7);
  v3 = new Vector3d(-2, 2, 7);
  v4 = new Vector3d(0, -3, -5);
  p2 = new Plane(c2, new Vector3d(3, 1, -3), v4);

  const t = Transform.PlaneToPlane(p1, p2);

  expect(c1.Transform(t).Equals(c2)).toBe(true);

  expect(
    t.Equals(
      new Transform([
        -0.09816429803311877, 0.9581933784990011, -0.268754944126308, -3.0119576265859593, 0.8068511325064378, -0.08145318259637324, -0.5851124926183007, 3.1113927105412107,
        -0.5825418616414995, -0.27428238814329964, -0.7651236181099526, 10.426477492257956, 0, 0, 0, 1,
      ])
    )
  ).toBe(true);
});

test('Transform decomposing', () => {
  const transform = new Transform([3, 0, 0, 2, 0, 2, 0, 3, 0, 0, -1, 1, 0, 0, 0, 1]);
  expect(transform.ScaleFactor).toMatchObject(new Vector3d(3, 2, 1));
  expect(transform.ScaleTransform).toMatchObject(new Transform([3, 0, 0, 0, 0, 2, 0, 0, 0, 0, 1, 0, 0, 0, 0, 1]));
  expect(transform.TranslationVector).toMatchObject(new Vector3d(2, 3, 1));
  expect(transform.TranslationTransform).toMatchObject(new Transform([1, 0, 0, 2, 0, 1, 0, 3, 0, 0, 1, 1, 0, 0, 0, 1]));
});

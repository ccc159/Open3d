import { Point3d } from '../src/Point3d';
import { Vector3d } from '../src/Vector3d';
import { BoundingBox } from '../src/BoundingBox';
import { Transform } from '../src/Transform';

let p1: Point3d;
let p2: Point3d;
let b1: BoundingBox;

beforeEach(() => {
  p1 = new Point3d(-9.847383153, -9.092637979, -8.103615608);
  p2 = new Point3d(4.992788358, 6.176224321, 6.748736056);
  b1 = new BoundingBox(p1, p2);
});

test('Min', () => {
  expect(b1.Min.Equals(new Point3d(-9.847383153, -9.092637979, -8.103615608))).toBe(true);
  b1.Min = new Point3d(100, 2, 3);
  expect(b1.IsValid).toBe(false);
});

test('Max', () => {
  expect(b1.Max.Equals(new Point3d(4.992788358, 6.176224321, 6.748736056))).toBe(true);
  b1.Max = new Point3d(100, 2, 3);
  expect(b1.IsValid).toBe(true);
});

test('Center', () => {
  expect(b1.Center.Equals(new Point3d(-2.427297397, -1.458206829, -0.677439776))).toBe(true);
});

test('IsValid', () => {
  expect(b1.IsValid).toBe(true);
  let b = BoundingBox.CreateFromMinMax(0, 0, 0, -1, -3, 0);
  expect(b.IsValid).toBe(false);
  b.MakeValid();
  expect(b.IsValid).toBe(true);
});

test('Area', () => {
  expect(b1.Area).toBeCloseTo(1347.564987468);
});

test('Diagonal', () => {
  expect(b1.Diagonal.Equals(new Vector3d(14.840171511, 15.2688623, 14.852351664))).toBe(true);
});

test('Volume', () => {
  expect(b1.Volume).toBeCloseTo(3365.432018859);
});

test('IsDegenerate', () => {
  expect(b1.IsDegenerate).toBe(0);
  b1.Max.Z = b1.Min.Z;
  expect(b1.IsDegenerate).toBe(1);
  b1.Max.Y = b1.Min.Y;
  expect(b1.IsDegenerate).toBe(2);
  b1.Max.X = b1.Min.X;
  expect(b1.IsDegenerate).toBe(3);
});

test('ClosestPoint', () => {
  const outside = new Point3d(13.502516727, -1.269467385, 4.154620531);
  const closestOutside = b1.ClosestPoint(outside);
  expect(closestOutside.Equals(new Point3d(4.992788358, -1.269467385, 4.154620531))).toBe(true);
  const inside = new Point3d(0.423155795, 0.952666255, 4.154620531);
  const closestInside = b1.ClosestPoint(inside);
  expect(closestInside.Equals(new Point3d(0.423155795, 0.952666255, 4.154620531))).toBe(true);
  const closestOnside = b1.ClosestPoint(inside, false);
  expect(closestOnside.Equals(new Point3d(0.423155795, 0.952666255, 6.748736056))).toBe(true);
});

test('FurthestPoint', () => {
  const outside = new Point3d(13.502516727, -1.269467385, 4.154620531);
  const closestOutside = b1.FurthestPoint(outside);
  expect(closestOutside.Equals(new Point3d(-9.847383153, -9.092637979, -8.103615608))).toBe(true);
  const inside = new Point3d(0.423155795, 0.952666255, 4.154620531);
  const closestInside = b1.FurthestPoint(inside);
  expect(closestInside.Equals(new Point3d(-9.847383153, -9.092637979, -8.103615608))).toBe(true);
  const p3 = new Point3d(-12, -10, -5);
  const p3c = b1.FurthestPoint(p3);
  expect(p3c.Equals(new Point3d(4.992788358, 6.176224321, 6.748736056))).toBe(true);
});

test('ContainsPoint', () => {
  const outside = new Point3d(13.502516727, -1.269467385, 4.154620531);
  const inside = new Point3d(0.423155795, 0.952666255, 4.154620531);
  const onside = new Point3d(0.423155795, 0.952666255, 6.748736056);

  expect(b1.ContainsPoint(outside)).toBe(false);
  expect(b1.ContainsPoint(inside)).toBe(true);
  expect(b1.ContainsPoint(onside)).toBe(true);
  expect(b1.ContainsPoint(onside, false)).toBe(false);
});

test('ContainsBoundingBox', () => {
  // pass
});

test('Clone', () => {
  const b2 = b1.Clone();
  expect(b1.Equals(b2)).toBe(true);
  b2.Max.X = 100;
  expect(b1.Equals(b2)).toBe(false);
});

test('PointAt', () => {
  const p = b1.PointAt(0.5, 0.5, 0.5);
  expect(p.Equals(new Point3d(-2.427297397, -1.458206829, -0.677439776))).toBe(true);
  const p1 = b1.PointAt(0.1, 0.2, 0.3);
  expect(p1.Equals(new Point3d(-8.3633660019, -6.038865519, -3.6479101088))).toBe(true);
});

test('Transform', () => {
  const xform = Transform.Rotation(0.5, new Vector3d(1, 2, 3), new Point3d(1, 2, 3));
  const b2 = b1.Transform(xform);
  const corners = b2.GetCorners();
  const expected = [
    new Point3d(-13.283339907, -12.7657304239, -10.5399179986),
    new Point3d(9.66788870992, -12.7657304239, -10.5399179986),
    new Point3d(9.66788870992, 8.25586797605, -10.5399179986),
    new Point3d(-13.283339907, 8.25586797605, -10.5399179986),
    new Point3d(-13.283339907, -12.7657304239, 9.8342897739),
    new Point3d(9.66788870992, -12.7657304239, 9.8342897739),
    new Point3d(9.66788870992, 8.25586797605, 9.8342897739),
    new Point3d(-13.283339907, 8.25586797605, 9.8342897739),
  ];
  for (let i = 0; i < 8; i++) {
    expect(corners[i].Equals(expected[i])).toBe(true);
  }
});

test('Union', () => {
  const b2 = new BoundingBox(new Point3d(-1.23854091944787, -16.7962328401021, -3.89436309536884), new Point3d(18.9579524423731, -3.21275057905436, 3.21602902149913));
  const b3 = b1.Union(b2);
  expect(b3.Equals(new BoundingBox(new Point3d(-9.847383153, -16.7962328401021, -8.103615608), new Point3d(18.9579524423731, 6.176224321, 6.748736056)))).toBe(true);
});

test('Intersect', () => {
  const b2 = new BoundingBox(new Point3d(-1.23854091944787, -16.7962328401021, -3.89436309536884), new Point3d(18.9579524423731, -3.21275057905436, 3.21602902149913));
  const b3 = b1.Intersect(b2);
  expect(b3.Equals(new BoundingBox(new Point3d(-1.23854091944787, -9.092637979, -3.89436309536884), new Point3d(4.992788358, -3.21275057905436, 3.21602902149913)))).toBe(true);
});

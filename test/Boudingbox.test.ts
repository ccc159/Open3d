import { Point3d } from '../src/Point3d';
import { Vector3d } from '../src/Vector3d';
import { BoundingBox } from '../src/BoundingBox';

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
  console.log(closestOnside);
  expect(closestOnside.Equals(new Point3d(0.423155795, 0.952666255, 6.748736056))).toBe(true);
});

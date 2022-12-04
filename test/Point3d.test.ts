import { Plane } from '../src/Plane';
import { Point3d } from '../src/Point3d';
import { Transform } from '../src/Transform';
import { Vector3d } from '../src/Vector3d';

let pt: Point3d;
let v1: Vector3d;
let v2: Vector3d;
let p1: Point3d;
let p2: Point3d;

beforeEach(() => {
  pt = new Point3d(1, 2, 3);
});

test('constructor', () => {
  pt = new Point3d(1, 2, 3);
  expect(pt.X).toBe(1);
  expect(pt.Y).toBe(2);
  expect(pt.Z).toBe(3);
});

test('CreateFromVector', () => {
  v1 = new Vector3d(1, 2, 3);
  pt = Point3d.CreateFromVector(v1);
  expect(pt.X).toBe(1);
  expect(pt.Y).toBe(2);
  expect(pt.Z).toBe(3);
});

test('CreateFromPoint3d', () => {
  p1 = new Point3d(1, 2, 3);
  pt = Point3d.CreateFromPoint3d(p1);
  expect(pt.X).toBe(1);
  expect(pt.Y).toBe(2);
  expect(pt.Z).toBe(3);
});

test('Origin', () => {
  expect(Point3d.Origin).toMatchObject(new Point3d(0, 0, 0));
});

test('Add', () => {
  v1 = new Vector3d(1, 2, 3);
  v2 = new Vector3d(4, 5, 6);
  expect(v1.Add(v2)).toMatchObject(new Vector3d(5, 7, 9));
});

test('AddPoint', () => {
  p1 = new Point3d(1, 2, 3);
  p2 = new Point3d(4, 5, 6);
  expect(p1.AddPoint(p2)).toMatchObject(new Point3d(5, 7, 9));
});

test('Subtract', () => {
  v1 = new Vector3d(1, 2, 3);
  v2 = new Vector3d(4, 5, 6);
  expect(v1.Subtract(v2)).toMatchObject(new Vector3d(-3, -3, -3));
});

test('SubtractPoint', () => {
  p1 = new Point3d(1, 2, 3);
  p2 = new Point3d(4, 5, 6);
  expect(p1.SubtractPoint(p2)).toMatchObject(new Vector3d(-3, -3, -3));
});

test('Multiply', () => {
  pt = new Point3d(1, 2, 3);
  expect(pt.Multiply(2)).toMatchObject(new Point3d(2, 4, 6));
  expect(pt.Multiply(0)).toMatchObject(new Point3d(0, 0, 0));
  expect(pt.Multiply(-3)).toMatchObject(new Point3d(-3, -6, -9));
});

test('Divide', () => {
  pt = new Point3d(2, 4, 6);
  expect(pt.Divide(2)).toMatchObject(new Point3d(1, 2, 3));
  expect(() => pt.Divide(0)).toThrow();
  expect(pt.Divide(-3)).toMatchObject(new Point3d(-2 / 3, -4 / 3, -2));
});

test('Interpolate', () => {
  p1 = new Point3d(-1, -2, -3);
  p2 = new Point3d(1, 2, 3);
  expect(Point3d.Interpolate(p1, p2, 0)).toMatchObject(new Point3d(-1, -2, -3));
  expect(Point3d.Interpolate(p1, p2, 0.5)).toMatchObject(new Point3d(0, 0, 0));
  expect(Point3d.Interpolate(p1, p2, 1)).toMatchObject(new Point3d(1, 2, 3));
  expect(Point3d.Interpolate(p1, p2, 2)).toMatchObject(new Point3d(3, 6, 9));
});

test('Distance', () => {
  p1 = new Point3d(1, 2, 3);
  p2 = new Point3d(1, 5, 7);
  expect(p1.DistanceTo(p2)).toBe(5);

  p1 = new Point3d(-1, -2, 3);
  p2 = new Point3d(4, 0, -8);
  expect(p1.DistanceTo(p2)).toBeCloseTo(12.247, 3);

  p1 = new Point3d(1, 0, 0);
  p2 = new Point3d(0, 1, 0);
  expect(p1.DistanceTo(p2)).toBeCloseTo(Math.sqrt(2));
});

test('Equals', () => {
  p1 = new Point3d(1, 2, 3);
  p2 = new Point3d(1, 5, 7);
  expect(p1.Equals(p2)).toBe(false);

  p1 = new Point3d(-1, -2, 3);
  p2 = new Point3d(-1, -2, 3);
  expect(p1.Equals(p2)).toBe(true);

  p1 = new Point3d(0, 0, 0);
  p2 = new Point3d(0, 0.000000001, 0);
  expect(p1.Equals(p2)).toBe(true);
});

test('Transform', () => {
  // test translation
  p1 = new Point3d(1, 3, 2);
  const translate = Transform.Translation(new Vector3d(1, 2, 3));
  expect(p1.Transform(translate).Equals(new Point3d(2, 5, 5))).toBe(true);

  // test rotation
  p1 = new Point3d(-5, 3, 0);
  const rotation = Transform.Rotation(Math.PI / 3, new Vector3d(1, 2, 3), new Point3d(1, 2, 3));
  expect(
    p1
      .Transform(rotation)
      .Equals(new Point3d(-4.54738093877396, -1.9003968027185, 3.11605818140365)),
  ).toBe(true);

  // test projection
  p1 = new Point3d(-5, 3, 0);
  const pplane = new Plane(
    Point3d.Origin,
    new Vector3d(8.66, 2.5, -4.33),
    new Vector3d(0, 8.66, 5),
  );

  const projection = Transform.PlanarProjection(pplane);
  expect(
    p1
      .Transform(projection)
      .Equals(new Point3d(-3.10045052477886, 1.35491777084041, 2.84928242090441)),
  ).toBe(true);

  // test mirror
  p1 = new Point3d(-5, 3, 0);
  const mplane = new Plane(
    Point3d.Origin,
    new Vector3d(8.66, 2.5, -4.33),
    new Vector3d(0, 8.66, 5),
  );

  const mirror = Transform.Mirror(mplane);
  expect(
    p1
      .Transform(mirror)
      .Equals(new Point3d(-1.20090104955773, -0.290164458319175, 5.69856484180881)),
  ).toBe(true);
});

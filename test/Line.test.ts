import { Line } from '../src/Line';
import { Transform } from '../src/Transform';
import { Point3d } from '../src/Point3d';
import { Vector3d } from '../src/Vector3d';

let v1: Point3d;
let v2: Point3d;
let l1: Line;
// let l2: Line;
let lInvalid: Line;

beforeEach(() => {
  v1 = new Point3d(-2, 6, 4);
  v2 = new Point3d(4, 8, -2);
  l1 = new Line(v1, v2);
  lInvalid = new Line(new Point3d(0, 0, 0), new Point3d(0, 0, 0));
});

test('Constructor', () => {
  expect(l1.From.Equals(v1)).toBe(true);
  expect(l1.To.Equals(v2)).toBe(true);
});

test('IsValid', () => {
  expect(l1.IsValid).toBe(true);
  expect(lInvalid.IsValid).toBe(false);
});

test('Direction', () => {
  expect(l1.Direction.Equals(new Vector3d(6, 2, -6))).toBe(true);
  expect(() => lInvalid.Direction).toThrow();
});

test('UnitDirection', () => {
  expect(l1.UnitDirection.X).toBeCloseTo(0.688, 3);
  expect(l1.UnitDirection.Y).toBeCloseTo(0.229, 3);
  expect(l1.UnitDirection.Z).toBeCloseTo(-0.688, 3);
  expect(() => lInvalid.UnitDirection).toThrow();
});

test('Length', () => {
  // get
  expect(l1.Length).toBeCloseTo(8.718, 3);
  expect(lInvalid.Length).toBe(0);

  // set
  l1.Length = 11;
  expect(l1.From.Equals(v1)).toBe(true);
  expect(l1.To.X).toBeCloseTo(5.571, 3);
  expect(l1.To.Y).toBeCloseTo(8.524, 3);
  expect(l1.To.Z).toBeCloseTo(-3.571, 3);
});

test('Equals', () => {
  expect(l1.Equals(l1)).toBe(true);
});

test('Clone', () => {
  expect(l1.Clone().Equals(l1)).toBe(true);
  expect(lInvalid.Clone().Equals(l1)).toBe(false);
});

test('PointAt', () => {
  expect(l1.PointAt(0).Equals(v1)).toBe(true);
  expect(l1.PointAt(1).Equals(v2)).toBe(true);
  expect(l1.PointAt(0.5).Equals(new Point3d(1, 7, 1))).toBe(true);
  expect(l1.PointAt(-1).Equals(new Point3d(-8, 4, 10))).toBe(true);

  expect(() => lInvalid.PointAt(0)).toThrow();
});

test('PointAtLength', () => {
  expect(l1.PointAtLength(0).Equals(v1)).toBe(true);
  expect(l1.PointAtLength(10).X).toBeCloseTo(4.882, 3);
  expect(l1.PointAtLength(10).Y).toBeCloseTo(8.294, 3);
  expect(l1.PointAtLength(10).Z).toBeCloseTo(-2.882, 3);
  expect(l1.PointAtLength(-1).X).toBeCloseTo(-2.688, 3);
  expect(l1.PointAtLength(-1).Y).toBeCloseTo(5.771, 3);
  expect(l1.PointAtLength(-1).Z).toBeCloseTo(4.688, 3);

  expect(() => lInvalid.PointAt(0)).toThrow();
});

test('ClosestParameter', () => {
  let p = new Point3d(0, 0, 0);
  expect(l1.ClosestParameter(p)).toBeCloseTo(0.315789, 3);
  expect(l1.ClosestPoint(p).X).toBeCloseTo(-0.105, 3);
  expect(l1.ClosestPoint(p).Y).toBeCloseTo(6.632, 3);
  expect(l1.ClosestPoint(p).Z).toBeCloseTo(2.105, 3);

  p = new Point3d(-16, 0, 0);
  expect(l1.ClosestParameter(p, true)).toBe(0);
  expect(l1.ClosestPoint(p, true).Equals(v1)).toBe(true);

  expect(l1.ClosestParameter(p)).toBeCloseTo(-0.947, 3);
  expect(l1.ClosestPoint(p).X).toBeCloseTo(-7.684, 3);
  expect(l1.ClosestPoint(p).Y).toBeCloseTo(4.105, 3);
  expect(l1.ClosestPoint(p).Z).toBeCloseTo(9.684, 3);

  expect(() => lInvalid.ClosestParameter(p)).toThrow();
});

test('ClosestPoint', () => {
  const p = new Point3d(1000, 1000, 0);
  l1 = new Line(new Point3d(0, 2000, 0), new Point3d(2000, 2000, 0));
  expect(l1.ClosestParameter(p)).toBeCloseTo(0.5, 3);
  expect(l1.ClosestPoint(p).Equals(new Point3d(1000, 2000, 0))).toBe(true);
});

test('DistanceTo', () => {
  let p = new Point3d(0, 0, 0);
  expect(l1.DistanceTo(p)).toBeCloseTo(6.959, 3);

  p = new Point3d(-16, 0, 0);
  expect(l1.DistanceTo(p, true)).toBeCloseTo(15.748, 3);
  expect(l1.DistanceTo(p)).toBeCloseTo(13.409, 3);

  expect(() => lInvalid.DistanceTo(p)).toThrow();
});

test('Extend', () => {
  expect(l1.Extend(1, 1).From.X).toBeCloseTo(-2.688, 3);
  expect(l1.Extend(1, 1).From.Y).toBeCloseTo(5.771, 3);
  expect(l1.Extend(1, 1).From.Z).toBeCloseTo(4.688, 3);
  expect(l1.Extend(1, 1).To.X).toBeCloseTo(4.688, 3);
  expect(l1.Extend(1, 1).To.Y).toBeCloseTo(8.229, 3);
  expect(l1.Extend(1, 1).To.Z).toBeCloseTo(-2.688, 3);
});

test('Flip', () => {
  expect(l1.Flip().From.Equals(v2)).toBe(true);
  expect(l1.Flip().To.Equals(v1)).toBe(true);
});

test('Transform', () => {
  // test rotation
  const rotation = Transform.Rotation(Math.PI / 2, new Vector3d(0, 0, 1), new Point3d(0, 0, 0));
  expect(
    l1.Transform(rotation).Equals(new Line(new Point3d(-6, -2, 4), new Point3d(-8, 4, -2))),
  ).toBe(true);
});

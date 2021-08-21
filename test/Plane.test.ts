import { Line } from '../src/Line';
import { ParallelIndicator } from '../src/Open3d';
import { Plane } from '../src/Plane';
import { Transform } from '../src/Transform';
import { Vector3d } from '../src/Vector3d';

let v1: Vector3d;
let v2: Vector3d;
let o: Vector3d;
let p1: Plane;
let p2: Plane;

beforeEach(() => {
  v1 = new Vector3d(1, 2, 3);
  v2 = new Vector3d(4, 5, 6);
  o = Vector3d.Zero;
  p1 = new Plane(o, v1, v2);
});

test('Constructor', () => {
  expect(p1.XAxis.IsParallelTo(v1)).toBe(ParallelIndicator.Parallel);
  expect(p1.YAxis.IsParallelTo(v2)).toBe(ParallelIndicator.NotParallel);
  expect(p1.YAxis.Length).toBeCloseTo(1);
});

test('Axis, Normal, AxisLine', () => {
  expect(p1.YAxisLine.Length).toBeCloseTo(1);
  expect(p1.ZAxisLine.To.X).toBeCloseTo(-0.408, 3);
});

test('Equation', () => {
  expect(p1.Equation[0]).toBeCloseTo(-0.408, 3);
  expect(p1.Equation[1]).toBeCloseTo(0.816, 3);
  expect(p1.Equation[2]).toBeCloseTo(-0.408, 3);
});

test('PointAt', () => {
  expect(p1.PointAt(5, 5).X).toBeCloseTo(5.701, 3);
  expect(p1.PointAt(5, 5).Y).toBeCloseTo(3.764, 3);
  expect(p1.PointAt(5, 5).Z).toBeCloseTo(1.827, 3);
  expect(p1.PointAt(0, 0).Equals(Vector3d.Zero)).toBe(true);
});

test('ClosestParameter', () => {
  const testPt1 = new Vector3d(-3, 2, 5);
  expect(p1.ClosestParameter(testPt1)[0]).toBeCloseTo(4.276, 3);
  expect(p1.ClosestParameter(testPt1)[1]).toBeCloseTo(-4.364, 3);

  const testPt2 = new Vector3d(0, 0, 0);
  expect(p1.ClosestParameter(testPt2)[0]).toBeCloseTo(0, 3);
  expect(p1.ClosestParameter(testPt2)[1]).toBeCloseTo(0, 3);
});

test('ClosestPoint', () => {
  const testPt1 = new Vector3d(-3, 2, 5);
  expect(p1.ClosestPoint(testPt1).X).toBeCloseTo(-2.667, 3);
  expect(p1.ClosestPoint(testPt1).Y).toBeCloseTo(1.333, 3);
  expect(p1.ClosestPoint(testPt1).Z).toBeCloseTo(5.333, 3);

  const testPt2 = new Vector3d(0, 0, 0);
  expect(p1.ClosestPoint(testPt2).Equals(Vector3d.Zero)).toBe(true);
});

test('DistanceTo', () => {
  const testPt1 = new Vector3d(-3, 2, 5);
  expect(p1.DistanceTo(testPt1)).toBeCloseTo(0.816, 3);

  expect(p1.DistanceTo(new Vector3d(3, -2, -3))).toBeCloseTo(-1.633, 3);

  const testPt2 = new Vector3d(0, 0, 0);
  expect(p1.DistanceTo(testPt2)).toBeCloseTo(0);
});

test('Clone', () => {
  expect(p1.Clone().XAxis.Equals(p1.XAxis)).toBe(true);
  expect(p1.Clone().YAxis.Equals(p1.YAxis)).toBe(true);
});

test('Flip', () => {
  expect(p1.Flip().XAxis.Equals(p1.YAxis)).toBe(true);
  expect(p1.Flip().YAxis.Equals(p1.XAxis)).toBe(true);
});

test('IsPointCoplanar', () => {
  expect(p1.IsPointCoplanar(new Vector3d(0, 0, 0))).toBe(true);
  expect(p1.IsPointCoplanar(new Vector3d(1, 2, 3))).toBe(true);
  expect(p1.IsPointCoplanar(new Vector3d(4, 5, 6))).toBe(true);
  expect(p1.IsPointCoplanar(new Vector3d(4, 5, 2))).toBe(false);
});

test('IsLineCoplanar', () => {
  expect(p1.IsLineCoplanar(new Line(v1, v2))).toBe(true);
  expect(p1.IsLineCoplanar(new Line(v1, o))).toBe(true);
  expect(p1.IsLineCoplanar(new Line(v1, new Vector3d(12, 5, 5)))).toBe(false);
});

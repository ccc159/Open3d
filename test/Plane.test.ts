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

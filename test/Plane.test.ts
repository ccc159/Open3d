import { Line } from '../src/Line';
import { Open3d } from '../src/Open3d';
import { Plane } from '../src/Plane';
import { Point3d } from '../src/Point3d';
import { Transform } from '../src/Transform';
import { Vector3d } from '../src/Vector3d';

let v1: Vector3d;
let v2: Vector3d;
let o: Point3d;
let p1: Plane;
let p2: Plane;

beforeEach(() => {
  v1 = new Vector3d(1, 2, 3);
  v2 = new Vector3d(4, 5, 6);
  o = Point3d.Origin;
  p1 = new Plane(o, v1, v2);
});

test('Constructor', () => {
  expect(p1.XAxis.IsParallelTo(v1)).toBe(Open3d.ParallelIndicator.Parallel);
  expect(p1.YAxis.IsParallelTo(v2)).toBe(Open3d.ParallelIndicator.NotParallel);
  expect(p1.YAxis.Length).toBeCloseTo(1);
});

test('CreateFromFrame', () => {
  expect(Plane.CreateFromFrame(o, v1, v2).YAxis.Equals(p1.YAxis)).toBe(true);
  expect(Plane.CreateFromFrame(o, v1, v2).ZAxisLine.Equals(p1.ZAxisLine)).toBe(true);
});

test('CreateFromNormal', () => {
  p2 = Plane.CreateFromNormal(o, p1.ZAxis);
  expect(p2.Origin.Equals(o)).toBe(true);
  expect(p2.XAxis.IsPerpendicularTo(p2.ZAxis)).toBe(true);
  expect(p2.XAxis.IsPerpendicularTo(p2.YAxis)).toBe(true);
  expect(p2.ZAxis.IsPerpendicularTo(p2.YAxis)).toBe(true);
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
  expect(p1.PointAt(0, 0).Equals(Point3d.Origin)).toBe(true);
});

test('ClosestParameter', () => {
  const testPt1 = new Point3d(-3, 2, 5);
  expect(p1.ClosestParameter(testPt1)[0]).toBeCloseTo(4.276, 3);
  expect(p1.ClosestParameter(testPt1)[1]).toBeCloseTo(-4.364, 3);

  const testPt2 = new Point3d(0, 0, 0);
  expect(p1.ClosestParameter(testPt2)[0]).toBeCloseTo(0, 3);
  expect(p1.ClosestParameter(testPt2)[1]).toBeCloseTo(0, 3);
});

test('ClosestPoint', () => {
  const testPt1 = new Point3d(-3, 2, 5);
  expect(p1.ClosestPoint(testPt1).X).toBeCloseTo(-2.667, 3);
  expect(p1.ClosestPoint(testPt1).Y).toBeCloseTo(1.333, 3);
  expect(p1.ClosestPoint(testPt1).Z).toBeCloseTo(5.333, 3);

  const testPt2 = new Point3d(0, 0, 0);
  expect(p1.ClosestPoint(testPt2).Equals(Point3d.Origin)).toBe(true);
});

test('DistanceTo', () => {
  const testPt1 = new Point3d(-3, 2, 5);
  expect(p1.DistanceTo(testPt1)).toBeCloseTo(0.816, 3);

  expect(p1.DistanceTo(new Point3d(3, -2, -3))).toBeCloseTo(-1.633, 3);

  const testPt2 = new Point3d(0, 0, 0);
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
  expect(p1.IsPointCoplanar(new Point3d(0, 0, 0))).toBe(true);
  expect(p1.IsPointCoplanar(new Point3d(1, 2, 3))).toBe(true);
  expect(p1.IsPointCoplanar(new Point3d(4, 5, 6))).toBe(true);
  expect(p1.IsPointCoplanar(new Point3d(4, 5, 2))).toBe(false);
});

test('IsLineCoplanar', () => {
  let pt1 = new Point3d(1, 2, 3);
  let pt2 = new Point3d(4, 5, 6);
  expect(p1.IsLineCoplanar(new Line(pt1, pt2))).toBe(true);
  expect(p1.IsLineCoplanar(new Line(pt1, o))).toBe(true);
  expect(p1.IsLineCoplanar(new Line(pt1, new Point3d(12, 5, 5)))).toBe(false);
});

test('Transform', () => {
  // test rotation
  const rotation = Transform.Rotation(Math.PI / 2, new Vector3d(-1, -3, -2), new Point3d(5, 3, 1));

  p2 = p1.Transform(rotation);
  expect(p2.Origin.X).toBeCloseTo(3.055, 3);
  expect(p2.Origin.Y).toBeCloseTo(1.977, 3);
  expect(p2.Origin.Z).toBeCloseTo(-4.493, 3);

  expect(p2.XAxis.X).toBeCloseTo(-0.109, 3);
  expect(p2.XAxis.Y).toBeCloseTo(0.816, 3);
  expect(p2.XAxis.Z).toBeCloseTo(0.568, 3);

  expect(p2.YAxis.X).toBeCloseTo(0.513, 3);
  expect(p2.YAxis.Y).toBeCloseTo(-0.443, 3);
  expect(p2.YAxis.Z).toBeCloseTo(0.735, 3);
});

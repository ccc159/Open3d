import { Intersection } from '../src/Intersection';
import { Line } from '../src/Line';
import { Plane } from '../src/Plane';
import { Point3d } from '../src/Point3d';
import { Vector3d } from '../src/Vector3d';

let v1: Point3d;
let v2: Point3d;
let l1: Line;
let l2: Line;
let p1: Plane;
let p2: Plane;
let lInvalid: Line;

beforeEach(() => {
  v1 = new Point3d(-2, 6, 4);
  v2 = new Point3d(4, 8, -2);
  l1 = new Line(v1, v2);
  lInvalid = new Line(new Point3d(0, 0, 0), new Point3d(0, 0, 0));

  p1 = new Plane(Point3d.Origin, new Vector3d(1, 2, 3), new Vector3d(4, 5, 6));
});

test('LineLine', () => {
  l2 = new Line(new Point3d(0, 0, 0), new Point3d(1.429, 10.0, 1.429));

  expect(Intersection.LineLine(l1, l2, true, 0.001)?.X).toBeCloseTo(1, 3);
  expect(Intersection.LineLine(l1, l2, true, 0.001)?.Y).toBeCloseTo(7, 3);
  expect(Intersection.LineLine(l1, l2, true, 0.001)?.Z).toBeCloseTo(1, 3);

  l1 = new Line(new Point3d(3, 3, 0), new Point3d(5, 5, 0));
  l2 = new Line(new Point3d(3, 5, 0), new Point3d(5, 3, 0));
  expect(Intersection.LineLine(l1, l2)?.Equals(new Point3d(4, 4, 0))).toBe(true);

  l1 = new Line(new Point3d(3, 3, 0), new Point3d(5, 5, 0));
  l2 = new Line(new Point3d(7, 5, 0), new Point3d(9, 3, 0));
  expect(Intersection.LineLine(l1, l2)?.Equals(new Point3d(6, 6, 0))).toBe(true);
  expect(Intersection.LineLine(l1, l2, true)).toBe(null);

  l1 = new Line(new Point3d(0, 1, 0), new Point3d(1, 0, 1));
  l2 = new Line(new Point3d(0, 0, 0), new Point3d(1, 1, 1));
  expect(Intersection.LineLine(l1, l2, true)?.Equals(new Point3d(0.5, .5, .5))).toBe(true);
  expect((Line.LineLineClosestPoints(l1, l2, true) as [Point3d, Point3d])[0].Equals(new Point3d(0.5, .5, .5))).toBe(true);

  l1 = new Line(new Point3d(0, 0, 0), new Point3d(1, 0, 0));
  l2 = new Line(new Point3d(0, 0, 0), new Point3d(0, 1, 0));
  expect(Intersection.LineLine(l1, l2, true)?.Equals(new Point3d(0, 0, 0))).toBe(true);
  expect((Line.LineLineClosestPoints(l1, l2, true) as [Point3d, Point3d])[0].Equals(new Point3d(0, 0, 0))).toBe(true);

  l1 = new Line(new Point3d(0, 0, 0), new Point3d(1, 0, 0));
  l2 = new Line(new Point3d(0, 1, 0), new Point3d(0, 2, 0));
  expect(Intersection.LineLine(l1, l2, true)).toBe(null);
});

test('LinePlane', () => {
  l2 = new Line(new Point3d(5, 0, 0), new Point3d(0, 5, 0));
  let intersect = Intersection.LinePlane(l2, p1);

  expect(intersect?.X).toBeCloseTo(3.333, 3);
  expect(intersect?.Y).toBeCloseTo(1.667, 3);
  expect(intersect?.Z).toBeCloseTo(0, 3);

  l2 = new Line(new Point3d(5, 0, 0), new Point3d(10, -5, 0));
  intersect = Intersection.LinePlane(l2, p1);

  expect(intersect?.X).toBeCloseTo(3.333, 3);
  expect(intersect?.Y).toBeCloseTo(1.667, 3);
  expect(intersect?.Z).toBeCloseTo(0, 3);

  intersect = Intersection.LinePlane(l2, p1, true);
  expect(intersect).toBe(null);

  l2 = new Line(new Point3d(5, 0, 0), new Point3d(5, 0, 5));
  intersect = Intersection.LinePlane(l2, p1, true);
  expect(intersect).toBe(null);
});

test('PlanePlane', () => {
  p1 = new Plane(Point3d.Origin, new Vector3d(1, 2, 3), new Vector3d(4, 5, 6));
  p2 = new Plane(new Point3d(-4, 1, 6), new Vector3d(5, 5, 3), new Vector3d(2, 6, 1));

  let line = Intersection.PlanePlane(p1, p2);
  expect(line?.From.Equals(new Point3d(-4.114727540500736, 0.9076583210603815, 5.9300441826215025))).toBe(true);
  expect(line?.To.Equals(new Point3d(-4.818389328318404, 0.341296394280307, 5.500982116879022))).toBe(true);

  expect(Intersection.PlanePlane(Plane.PlaneXY, Plane.PlaneXY)).toBe(null);
});

test('PlanePlanePlane', () => {
  p1 = new Plane(Point3d.Origin, new Vector3d(1, 2, 3), new Vector3d(4, 5, 6));
  p2 = new Plane(new Point3d(-4, 1, 6), new Vector3d(5, 5, 3), new Vector3d(2, 6, 1));
  let p3 = new Plane(new Point3d(2, 5, 7), new Vector3d(7, 1, -4), new Vector3d(-3, 2, 8));

  expect(Intersection.PlanePlanePlane(p1, p2, p3)?.Equals(new Point3d(2.9622641509433913, 6.603773584905657, 10.245283018867923))).toBe(true);
  expect(Intersection.PlanePlanePlane(Plane.PlaneXY, Plane.PlaneXY, p1)).toBe(null);
});
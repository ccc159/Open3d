import { Intersection } from '../src/Intersection';
import { Line } from '../src/Line';
import { Plane } from '../src/Plane';
import { Transform } from '../src/Transform';
import { Vector3d } from '../src/Vector3d';

let v1: Vector3d;
let v2: Vector3d;
let l1: Line;
let l2: Line;
let p1: Plane;
let p2: Plane;
let lInvalid: Line;

beforeEach(() => {
  v1 = new Vector3d(-2, 6, 4);
  v2 = new Vector3d(4, 8, -2);
  l1 = new Line(v1, v2);
  lInvalid = new Line(new Vector3d(0, 0, 0), new Vector3d(0, 0, 0));

  p1 = new Plane(Vector3d.Zero, new Vector3d(1, 2, 3), new Vector3d(4, 5, 6));
});

test('LineLine', () => {
  l2 = new Line(new Vector3d(0, 0, 0), new Vector3d(1.429, 10.0, 1.429));

  expect(Intersection.LineLine(l1, l2, true, 0.001)?.X).toBeCloseTo(1, 3);
  expect(Intersection.LineLine(l1, l2, true, 0.001)?.Y).toBeCloseTo(7, 3);
  expect(Intersection.LineLine(l1, l2, true, 0.001)?.Z).toBeCloseTo(1, 3);

  l1 = new Line(new Vector3d(3, 3, 0), new Vector3d(5, 5, 0));
  l2 = new Line(new Vector3d(3, 5, 0), new Vector3d(5, 3, 0));
  expect(Intersection.LineLine(l1, l2)?.Equals(new Vector3d(4, 4, 0))).toBe(true);

  l1 = new Line(new Vector3d(3, 3, 0), new Vector3d(5, 5, 0));
  l2 = new Line(new Vector3d(7, 5, 0), new Vector3d(9, 3, 0));
  expect(Intersection.LineLine(l1, l2)?.Equals(new Vector3d(6, 6, 0))).toBe(true);
  expect(Intersection.LineLine(l1, l2, true)).toBe(null);

  l1 = new Line(new Vector3d(0, 0, 0), new Vector3d(1, 0, 0));
  l2 = new Line(new Vector3d(0, 0, 0), new Vector3d(0, 1, 0));
  expect(Intersection.LineLine(l1, l2, true)?.Equals(new Vector3d(0, 0, 0))).toBe(true);

  l1 = new Line(new Vector3d(0, 0, 0), new Vector3d(1, 0, 0));
  l2 = new Line(new Vector3d(0, 1, 0), new Vector3d(0, 2, 0));
  expect(Intersection.LineLine(l1, l2, true)).toBe(null);
});

test('LinePlane', () => {
  l2 = new Line(new Vector3d(5, 0, 0), new Vector3d(0, 5, 0));
  let intersect = Intersection.LinePlane(l2, p1);

  expect(intersect?.X).toBeCloseTo(3.333, 3);
  expect(intersect?.Y).toBeCloseTo(1.667, 3);
  expect(intersect?.Z).toBeCloseTo(0, 3);

  l2 = new Line(new Vector3d(5, 0, 0), new Vector3d(10, -5, 0));
  intersect = Intersection.LinePlane(l2, p1);

  expect(intersect?.X).toBeCloseTo(3.333, 3);
  expect(intersect?.Y).toBeCloseTo(1.667, 3);
  expect(intersect?.Z).toBeCloseTo(0, 3);

  intersect = Intersection.LinePlane(l2, p1, true);
  expect(intersect).toBe(null);

  l2 = new Line(new Vector3d(5, 0, 0), new Vector3d(5, 0, 5));
  intersect = Intersection.LinePlane(l2, p1, true);
  expect(intersect).toBe(null);
});

import { Line } from '../src/Line';
import { ParallelIndicator } from '../src/Open3d';
import { Plane } from '../src/Plane';
import { Transform } from '../src/Transform';
import { Vector3d } from '../src/Vector3d';

let v1: Vector3d;
let v2: Vector3d;
let l1: Line;
let l2: Line;
let lInvalid: Line;

beforeEach(() => {
  v1 = new Vector3d(-2, 6, 4);
  v2 = new Vector3d(4, 8, -2);
  l1 = new Line(v1, v2);
  lInvalid = new Line(new Vector3d(0, 0, 0), new Vector3d(0, 0, 0));
});

test('LineLineIntersection', () => {
  l2 = new Line(new Vector3d(0, 0, 0), new Vector3d(1.429, 10.0, 1.429));

  expect(Line.LineLineIntersection(l1, l2, true, 0.001)?.X).toBeCloseTo(1, 3);
  expect(Line.LineLineIntersection(l1, l2, true, 0.001)?.Y).toBeCloseTo(7, 3);
  expect(Line.LineLineIntersection(l1, l2, true, 0.001)?.Z).toBeCloseTo(1, 3);

  l1 = new Line(new Vector3d(3, 3, 0), new Vector3d(5, 5, 0));
  l2 = new Line(new Vector3d(3, 5, 0), new Vector3d(5, 3, 0));
  expect(Line.LineLineIntersection(l1, l2)?.Equals(new Vector3d(4, 4, 0))).toBe(true);

  l1 = new Line(new Vector3d(3, 3, 0), new Vector3d(5, 5, 0));
  l2 = new Line(new Vector3d(7, 5, 0), new Vector3d(9, 3, 0));
  expect(Line.LineLineIntersection(l1, l2)?.Equals(new Vector3d(6, 6, 0))).toBe(true);
  expect(Line.LineLineIntersection(l1, l2, true)).toBe(null);

  l1 = new Line(new Vector3d(0, 0, 0), new Vector3d(1, 0, 0));
  l2 = new Line(new Vector3d(0, 0, 0), new Vector3d(0, 1, 0));
  expect(Line.LineLineIntersection(l1, l2, true)?.Equals(new Vector3d(0, 0, 0))).toBe(true);

  l1 = new Line(new Vector3d(0, 0, 0), new Vector3d(1, 0, 0));
  l2 = new Line(new Vector3d(0, 1, 0), new Vector3d(0, 2, 0));
  expect(Line.LineLineIntersection(l1, l2, true)).toBe(null);
});

test('Transform', () => {
  // test rotation
  const rotation = Transform.Rotation(Math.PI / 2, new Vector3d(0, 0, 1), new Vector3d(0, 0, 0));
  expect(l1.Transform(rotation).Equals(new Line(new Vector3d(-6, -2, 4), new Vector3d(-8, 4, -2)))).toBe(true);
});

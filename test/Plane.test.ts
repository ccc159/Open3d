import { ParallelIndicator } from '../src/Open3d';
import { Plane } from '../src/Plane';
import { Transform } from '../src/Transform';
import { Vector3d } from '../src/Vector3d';

let v1: Vector3d;
let v2: Vector3d;
let p1: Plane;
let p2: Plane;

beforeEach(() => {
  v1 = new Vector3d(8.66, 2.5, -4.33);
  v2 = new Vector3d(0, 8.66, 5);
  p1 = new Plane(Vector3d.Zero, v1, v2);
});

test('Constructor', () => {
  expect(p1.XAxis.IsParallelTo(v1)).toBe(ParallelIndicator.Parallel);
  expect(p1.YAxis.IsParallelTo(v2)).toBe(ParallelIndicator.Parallel);
});

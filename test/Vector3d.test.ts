import { ParallelIndicator } from '../src/Open3d';
import { Plane } from '../src/Plane';
import { Transform } from '../src/Transform';
import { Vector3d } from '../src/Vector3d';

let vec: Vector3d;
let v1: Vector3d;
let v2: Vector3d;

beforeEach(() => {
  vec = new Vector3d(1, 2, 3);
});

test('constructor', () => {
  vec = new Vector3d(1, 2, 3);
  expect(vec.X).toBe(1);
  expect(vec.Y).toBe(2);
  expect(vec.Z).toBe(3);
});

test('IsUnitVector', () => {
  vec = new Vector3d(1, 2, 3);
  expect(vec.IsUnitVector).toBe(false);
  vec = new Vector3d(1, 0, 0);
  expect(vec.IsUnitVector).toBe(true);
});

test('IsZero', () => {
  vec = new Vector3d(0.00001, 0, 0);
  expect(vec.IsZero).toBe(false);
  vec = new Vector3d(0.00000000001, 0, 0);
  expect(vec.IsZero).toBe(true);
  vec = new Vector3d(0, 0, 0);
  expect(vec.IsZero).toBe(true);
});

test('Length', () => {
  vec = new Vector3d(3, 4, 0);
  expect(vec.Length).toBe(5);
  vec = new Vector3d(0, 0, 0);
  expect(vec.Length).toBe(0);
});

test('XAxis, YAxis, ZAxis, Zero', () => {
  expect(Vector3d.XAxis).toMatchObject(new Vector3d(1, 0, 0));
  expect(Vector3d.YAxis).toMatchObject(new Vector3d(0, 1, 0));
  expect(Vector3d.ZAxis).toMatchObject(new Vector3d(0, 0, 1));
  expect(Vector3d.Zero).toMatchObject(new Vector3d(0, 0, 0));
});

test('Add', () => {
  v1 = new Vector3d(1, 2, 3);
  v2 = new Vector3d(4, 5, 6);
  expect(v1.Add(v2)).toMatchObject(new Vector3d(5, 7, 9));
});

test('Subtract', () => {
  v1 = new Vector3d(1, 2, 3);
  v2 = new Vector3d(4, 5, 6);
  expect(v1.Subtract(v2)).toMatchObject(new Vector3d(-3, -3, -3));
});

test('Multiply', () => {
  vec = new Vector3d(1, 2, 3);
  expect(vec.Multiply(2)).toMatchObject(new Vector3d(2, 4, 6));
  expect(vec.Multiply(0)).toMatchObject(new Vector3d(0, 0, 0));
  expect(vec.Multiply(-3)).toMatchObject(new Vector3d(-3, -6, -9));
});

test('Divide', () => {
  vec = new Vector3d(2, 4, 6);
  expect(vec.Divide(2)).toMatchObject(new Vector3d(1, 2, 3));
  expect(() => vec.Divide(0)).toThrowError();
  expect(vec.Divide(-3)).toMatchObject(new Vector3d(-2 / 3, -4 / 3, -2));
});

test('Interpolate', () => {
  v1 = new Vector3d(-1, -2, -3);
  v2 = new Vector3d(1, 2, 3);
  expect(Vector3d.Interpolate(v1, v2, 0)).toMatchObject(new Vector3d(-1, -2, -3));
  expect(Vector3d.Interpolate(v1, v2, 0.5)).toMatchObject(new Vector3d(0, 0, 0));
  expect(Vector3d.Interpolate(v1, v2, 1)).toMatchObject(new Vector3d(1, 2, 3));
  expect(Vector3d.Interpolate(v1, v2, 2)).toMatchObject(new Vector3d(3, 6, 9));
});

test('DotProduct', () => {
  v1 = new Vector3d(1, 2, 3);
  v2 = new Vector3d(1, 5, 7);
  expect(v1.DotProduct(v2)).toBe(32);

  v1 = new Vector3d(1, 2, 3);
  v2 = new Vector3d(1, 2, 3);
  expect(v1.DotProduct(v2)).toBe(14);

  v1 = new Vector3d(-1, -2, 3);
  v2 = new Vector3d(4, 0, -8);
  expect(v1.DotProduct(v2)).toBe(-28);

  v1 = new Vector3d(1, 0, 0);
  v2 = new Vector3d(0, 1, 0);
  expect(v1.DotProduct(v2)).toBe(0);
});

test('CrossProduct', () => {
  v1 = new Vector3d(1, 2, 3);
  v2 = new Vector3d(1, 5, 7);
  expect(v1.CrossProduct(v2)).toMatchObject(new Vector3d(-1, -4, 3));

  v1 = new Vector3d(-1, -2, 3);
  v2 = new Vector3d(4, 0, -8);
  expect(v1.CrossProduct(v2)).toMatchObject(new Vector3d(16, 4, 8));

  v1 = new Vector3d(1, 0, 0);
  v2 = new Vector3d(0, 1, 0);
  expect(v1.CrossProduct(v2)).toMatchObject(new Vector3d(0, 0, 1));
});

test('Distance', () => {
  v1 = new Vector3d(1, 2, 3);
  v2 = new Vector3d(1, 5, 7);
  expect(v1.DistanceTo(v2)).toBe(5);

  v1 = new Vector3d(-1, -2, 3);
  v2 = new Vector3d(4, 0, -8);
  expect(v1.DistanceTo(v2)).toBeCloseTo(12.247, 3);

  v1 = new Vector3d(1, 0, 0);
  v2 = new Vector3d(0, 1, 0);
  expect(v1.DistanceTo(v2)).toBeCloseTo(Math.sqrt(2));
});

test('Equals', () => {
  v1 = new Vector3d(1, 2, 3);
  v2 = new Vector3d(1, 5, 7);
  expect(v1.Equals(v2)).toBe(false);

  v1 = new Vector3d(-1, -2, 3);
  v2 = new Vector3d(-1, -2, 3);
  expect(v1.Equals(v2)).toBe(true);

  v1 = new Vector3d(0, 0, 0);
  v2 = new Vector3d(0, 0.000000001, 0);
  expect(v1.Equals(v2)).toBe(true);
});

test('VectorAngle', () => {
  v1 = new Vector3d(1, 2, 3);
  v2 = new Vector3d(1, 5, 7);
  expect(v1.VectorAngle(v2)).toBeCloseTo((9.054 * Math.PI) / 180, 3);

  v1 = new Vector3d(1, 2, 3);
  v2 = new Vector3d(1, 2, 3);
  expect(v1.VectorAngle(v2)).toBe(0);

  v1 = new Vector3d(-1, -2, 3);
  v2 = new Vector3d(4, 0, -8);
  expect(v1.VectorAngle(v2)).toBeCloseTo((146.789 * Math.PI) / 180, 3);

  v1 = new Vector3d(0, 0, 0);
  v2 = new Vector3d(0, 0, 0);
  expect(() => v1.VectorAngle(v2)).toThrowError();
});

test('Reverse', () => {
  v1 = new Vector3d(1, 2, 3);
  expect(v1.Reverse()).toMatchObject(new Vector3d(-1, -2, -3));

  v1 = new Vector3d(-1, -2, 3);
  expect(v1.Reverse()).toMatchObject(new Vector3d(1, 2, -3));

  v1 = new Vector3d(0, 0, 0);
  expect(v1.Reverse()).toMatchObject(new Vector3d(-0, -0, -0));
});

test('Unitize', () => {
  v1 = new Vector3d(2, 0, 0);
  expect(v1.Unitize()).toMatchObject(new Vector3d(1, 0, 0));

  v1 = new Vector3d(1, 2, 3);
  expect(v1.Unitize().X).toBeCloseTo(0.267, 3);
  expect(v1.Unitize().Y).toBeCloseTo(0.535, 3);
  expect(v1.Unitize().Z).toBeCloseTo(0.802, 3);

  v1 = new Vector3d(0, 0, 0);
  expect(() => v1.Unitize()).toThrowError();
});

test('IsParallelTo', () => {
  v1 = new Vector3d(1, 2, 3);
  v2 = new Vector3d(1, 5, 7);
  expect(v1.IsParallelTo(v2)).toBe(ParallelIndicator.NotParallel);

  v1 = new Vector3d(1, 2, 3);
  v2 = new Vector3d(1, 2, 3);
  expect(v1.IsParallelTo(v2)).toBe(ParallelIndicator.Parallel);

  v1 = new Vector3d(1, 2, 3);
  v2 = new Vector3d(2, 4, 6);
  expect(v1.IsParallelTo(v2)).toBe(ParallelIndicator.Parallel);

  v1 = new Vector3d(0, 0, 0);
  v2 = new Vector3d(0, 0, 0);
  expect(v1.IsParallelTo(v2)).toBe(ParallelIndicator.Parallel);

  v1 = new Vector3d(1, 2, 3);
  v2 = new Vector3d(-1, -2, -3);
  expect(v1.IsParallelTo(v2)).toBe(ParallelIndicator.AntiParallel);
});

test('IsPerpendicularTo', () => {
  v1 = new Vector3d(1, 2, 3);
  v2 = new Vector3d(1, 5, 7);
  expect(v1.IsPerpendicularTo(v2)).toBe(false);

  v1 = new Vector3d(1, 2, 3);
  v2 = new Vector3d(-2.432, 0.374, 0.561);
  expect(v1.IsPerpendicularTo(v2)).toBe(true);

  v1 = new Vector3d(0, 0, 0);
  v2 = new Vector3d(0, 0, 0);
  expect(v1.IsPerpendicularTo(v2)).toBe(true);

  v1 = new Vector3d(1, 2, 3);
  v2 = new Vector3d(-1, -2, -3);
  expect(v1.IsPerpendicularTo(v2)).toBe(false);
});

test('Rotate', () => {
  v1 = new Vector3d(1, 0, 0);
  expect(v1.Rotate(Math.PI / 2, Vector3d.ZAxis).Equals(new Vector3d(0, 1, 0))).toBe(true);

  v1 = new Vector3d(1, 2, 3);
  expect(v1.Rotate(Math.PI / 2, Vector3d.ZAxis).Equals(new Vector3d(-2, 1, 3))).toBe(true);

  v1 = new Vector3d(1, 5, 7);
  expect(v1.Rotate(Math.PI / 2, Vector3d.XAxis).Equals(new Vector3d(1, -7, 5))).toBe(true);

  v1 = new Vector3d(1, 5, 7);
  const rotated = v1.Rotate(Math.PI, new Vector3d(1, 2, 3));
  expect(rotated.X).toBeCloseTo(3.571, 3);
  expect(rotated.Y).toBeCloseTo(4.143, 3);
  expect(rotated.Z).toBeCloseTo(6.714, 3);

  v1 = new Vector3d(1, 2, 0);
  expect(() => v1.Rotate(Math.PI, new Vector3d(0, 0, 0))).toThrowError();
});

test('Transform', () => {
  // test translation
  v1 = new Vector3d(1, 3, 2);
  const translate = Transform.Translation(new Vector3d(1, 2, 3));
  expect(v1.Transform(translate).Equals(new Vector3d(2, 5, 5))).toBe(true);

  // test rotation
  v1 = new Vector3d(-5, 3, 0);
  const rotation = Transform.Rotation(Math.PI / 3, new Vector3d(1, 2, 3), new Vector3d(1, 2, 3));
  expect(v1.Transform(rotation).Equals(new Vector3d(-4.54738093877396, -1.9003968027185, 3.11605818140365))).toBe(true);

  // test projection
  v1 = new Vector3d(-5, 3, 0);
  const pplane = new Plane(Vector3d.Zero, new Vector3d(8.66, 2.5, -4.33), new Vector3d(0, 8.66, 5));

  const projection = Transform.PlanarProjection(pplane);
  expect(v1.Transform(projection).Equals(new Vector3d(-3.10045052477886, 1.35491777084041, 2.84928242090441))).toBe(true);

  // test mirror
  v1 = new Vector3d(-5, 3, 0);
  const mplane = new Plane(Vector3d.Zero, new Vector3d(8.66, 2.5, -4.33), new Vector3d(0, 8.66, 5));

  const mirror = Transform.Mirror(mplane);
  expect(v1.Transform(mirror).Equals(new Vector3d(-1.20090104955773, -0.290164458319175, 5.69856484180881))).toBe(true);
});
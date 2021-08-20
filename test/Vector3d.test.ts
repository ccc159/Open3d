import { Vector3d } from '../src/Vector3d';

let vec: Vector3d;

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
  const v1 = new Vector3d(1, 2, 3);
  const v2 = new Vector3d(4, 5, 6);
  expect(v1.Add(v2)).toMatchObject(new Vector3d(5, 7, 9));
});

test('Subtract', () => {
  const v1 = new Vector3d(1, 2, 3);
  const v2 = new Vector3d(4, 5, 6);
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
  const v1 = new Vector3d(-1, -2, -3);
  const v2 = new Vector3d(1, 2, 3);
  expect(Vector3d.Interpolate(v1, v2, 0)).toMatchObject(new Vector3d(-1, -2, -3));
  expect(Vector3d.Interpolate(v1, v2, 0.5)).toMatchObject(new Vector3d(0, 0, 0));
  expect(Vector3d.Interpolate(v1, v2, 1)).toMatchObject(new Vector3d(1, 2, 3));
  expect(Vector3d.Interpolate(v1, v2, 2)).toMatchObject(new Vector3d(3, 6, 9));
});

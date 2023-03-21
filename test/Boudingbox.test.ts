import { Line } from '../src/Line';
import { Transform } from '../src/Transform';
import { Point3d } from '../src/Point3d';
import { Vector3d } from '../src/Vector3d';
import { BoundingBox } from '../src/BoundingBox';

let b1: BoundingBox;

beforeEach(() => {
  b1 = new BoundingBox(-9.847383153, -9.092637979, -8.103615608, 4.992788358, 6.176224321, 6.748736056);
});

test('Min', () => {
  expect(b1.Min.Equals(new Point3d(-9.847383153, -9.092637979, -8.103615608))).toBe(true);
});

test('Max', () => {
  expect(b1.Max.Equals(new Point3d(4.992788358, 6.176224321, 6.748736056))).toBe(true);
});

test('Center', () => {
  expect(b1.Center.Equals(new Point3d(-2.427297397, -1.458206829, -0.677439776))).toBe(true);
});

test('IsValid', () => {
  expect(b1.IsValid).toBe(true);
  let b = new BoundingBox(0, 0, 0, -1, -3, 0);
  expect(b.IsValid).toBe(false);
  b.MakeValid();
  expect(b.IsValid).toBe(true);
});

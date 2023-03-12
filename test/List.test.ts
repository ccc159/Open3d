import { List } from '../src/List';

let v1: List<number>;
let v2: List<string>;
let v3: List<number>;

beforeEach(() => {
  v1 = new List<number>([1, 2, 3]);
  v2 = new List<string>(['a', 'b', 'c']);
  v3 = new List<number>();
});

test('First', () => {
  expect(v1.First).toBe(1);
  expect(v2.First).toBe('a');
  expect(v3.First).toBe(undefined);
  v3.First = 3;
  expect(v3.First).toBe(3);
});

test('Last', () => {
  expect(v1.Last).toBe(3);
  expect(v2.Last).toBe('c');
  expect(v3.Last).toBe(undefined);
  v3.Last = 3;
  expect(v3.Last).toBe(3);
});

test('Count', () => {
  expect(v1.Count).toBe(3);
  expect(v2.Count).toBe(3);
  expect(v3.Count).toBe(0);
  v3.Add(1);
  expect(v3.Count).toBe(1);
});

test('Clear', () => {
  expect(v1.Count).toBe(3);
  v1.Clear();
  expect(v1.Count).toBe(0);
});

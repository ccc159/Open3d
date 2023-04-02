import { Interval } from '../src/Interval';

let i1: Interval;
let i2: Interval;
let i3: Interval;
let i4: Interval;

beforeEach(() => {
  i1 = new Interval(-10, 10);
  i2 = new Interval(20, 0);
  i3 = new Interval(0, 0);
  i4 = new Interval(NaN, 1);
});

test('Clone', () => {
  expect(i1.Clone().Equals(i1)).toBe(true);
  expect(i2.Clone().Equals(i2)).toBe(true);
  expect(i3.Clone().Equals(i3)).toBe(true);
  expect(i4.Clone().Equals(i4)).toBe(false);
});

test('T0', () => {
  expect(i1.T0).toBe(-10);
  expect(i2.T0).toBe(20);
  expect(i3.T0).toBe(0);
  expect(i4.T0).toBe(NaN);
});

test('T1', () => {
  expect(i1.T1).toBe(10);
  expect(i2.T1).toBe(0);
  expect(i3.T1).toBe(0);
  expect(i4.T1).toBe(1);
});

test('Min', () => {
  expect(i1.Min).toBe(-10);
  expect(i2.Min).toBe(0);
  expect(i3.Min).toBe(0);
  expect(i4.Min).toBe(NaN);
});

test('Max', () => {
  expect(i1.Max).toBe(10);
  expect(i2.Max).toBe(20);
  expect(i3.Max).toBe(0);
  expect(i4.Max).toBe(NaN);
});

test('Mid', () => {
  expect(i1.Mid).toBe(0);
  expect(i2.Mid).toBe(10);
  expect(i3.Mid).toBe(0);
  expect(i4.Mid).toBe(NaN);
});

test('Length', () => {
  expect(i1.Length).toBe(20);
  expect(i2.Length).toBe(-20);
  expect(i3.Length).toBe(0);
  expect(i4.Length).toBe(0);
});

test('IsSingleton', () => {
  expect(i1.IsSingleton).toBe(false);
  expect(i2.IsSingleton).toBe(false);
  expect(i3.IsSingleton).toBe(true);
  expect(i4.IsSingleton).toBe(false);
});

test('IsIncreasing', () => {
  expect(i1.IsIncreasing).toBe(true);
  expect(i2.IsIncreasing).toBe(false);
  expect(i3.IsIncreasing).toBe(false);
  expect(i4.IsIncreasing).toBe(false);
});

test('IsDecreasing', () => {
  expect(i1.IsDecreasing).toBe(false);
  expect(i2.IsDecreasing).toBe(true);
  expect(i3.IsDecreasing).toBe(false);
  expect(i4.IsDecreasing).toBe(false);
});

test('MakeIncreasing', () => {
  expect(i1.MakeIncreasing().Equals(new Interval(-10, 10))).toBe(true);
  expect(i2.MakeIncreasing().Equals(new Interval(0, 20))).toBe(true);
  expect(i3.MakeIncreasing().Equals(new Interval(0, 0))).toBe(true);
  expect(i4.MakeIncreasing().Equals(Interval.Empty)).toBe(true);
});

test('Swap', () => {
  expect(i1.Swap().Equals(new Interval(10, -10))).toBe(true);
  expect(i2.Swap().Equals(new Interval(0, 20))).toBe(true);
  expect(i3.Swap().Equals(new Interval(0, 0))).toBe(true);
  expect(i4.Swap().T0 === 1).toBe(true);
});

test('Reverse', () => {
  expect(i1.Reverse().Equals(new Interval(-10, 10))).toBe(true);
  expect(i2.Reverse().Equals(new Interval(0, -20))).toBe(true);
  expect(i3.Reverse().Equals(new Interval(0, 0))).toBe(true);
  expect(i4.Reverse().Equals(Interval.Empty)).toBe(true);
});

test('Grow', () => {
  expect(i1.Grow(15).Equals(new Interval(-10, 15))).toBe(true);
  expect(i2.Grow(15).Equals(new Interval(0, 20))).toBe(true);
  expect(i3.Grow(15).Equals(new Interval(0, 15))).toBe(true);
  expect(i4.Grow(15).Equals(new Interval(0, 15))).toBe(true);
});

test('ParameterAt', () => {
  expect(i1.ParameterAt(0.5)).toBeCloseTo(0);
  expect(i2.ParameterAt(0.5)).toBeCloseTo(10);
  expect(i3.ParameterAt(0.5)).toBeCloseTo(0);
  expect(i4.ParameterAt(0.5)).toBe(NaN);
});

test('ParameterIntervalAt', () => {
  expect(i1.ParameterIntervalAt(new Interval(0.2, 0.77)).Equals(new Interval(-6, 5.4))).toBe(true);
  expect(i2.ParameterIntervalAt(new Interval(0.2, 0.77)).Equals(new Interval(16, 4.6))).toBe(true);
  expect(i3.ParameterIntervalAt(new Interval(0.2, 0.77)).Equals(new Interval(0, 0))).toBe(true);
  expect(i4.ParameterIntervalAt(new Interval(0.2, 0.77)).IsValid).toBe(false);
});

test('NormalizedParameterAt', () => {
  expect(i1.NormalizedParameterAt(8)).toBeCloseTo(0.9);
  expect(i2.NormalizedParameterAt(8)).toBeCloseTo(0.6);
  expect(i3.NormalizedParameterAt(8)).toBeCloseTo(0);
  expect(i4.NormalizedParameterAt(8)).toBe(NaN);
});

test('NormalizedIntervalAt', () => {
  expect(i1.NormalizedIntervalAt(new Interval(0.2, 0.77)).Equals(new Interval(0.51, 0.5385))).toBe(true);
  expect(i2.NormalizedIntervalAt(new Interval(0.2, 0.77)).Equals(new Interval(0.99, 0.9615))).toBe(true);
  expect(i3.NormalizedIntervalAt(new Interval(0.2, 0.77)).Equals(new Interval(0, 0))).toBe(true);
  expect(i4.NormalizedIntervalAt(new Interval(0.2, 0.77)).IsValid).toBe(false);
});

test('IncludesParameter', () => {
  expect(i1.IncludesParameter(0)).toBe(true);
  expect(i2.IncludesParameter(0)).toBe(true);
  expect(i3.IncludesParameter(0)).toBe(true);
  expect(i4.IncludesParameter(0)).toBe(false);
  expect(i1.IncludesParameter(10)).toBe(true);
  expect(i1.IncludesParameter(10, true)).toBe(false);
  expect(i2.IncludesParameter(10)).toBe(true);
  expect(i3.IncludesParameter(10)).toBe(false);
  expect(i4.IncludesParameter(10)).toBe(false);
});

test('IncludesInterval', () => {
  expect(i1.IncludesInterval(new Interval(0, 0))).toBe(true);
  expect(i2.IncludesInterval(new Interval(0, 0))).toBe(true);
  expect(i3.IncludesInterval(new Interval(0, 0))).toBe(true);
  expect(i4.IncludesInterval(new Interval(0, 0))).toBe(false);
  expect(i1.IncludesInterval(new Interval(0, 10))).toBe(true);
  expect(i1.IncludesInterval(new Interval(0, 10), true)).toBe(false);
  expect(i2.IncludesInterval(new Interval(0, 10))).toBe(true);
  expect(i3.IncludesInterval(new Interval(0, 10))).toBe(false);
  expect(i4.IncludesInterval(new Interval(0, 10))).toBe(false);
});

test('Union', () => {
  expect(i1.Union(new Interval(-5, 5)).Equals(new Interval(-10, 10))).toBe(true);
  expect(i2.Union(new Interval(-5, 5)).Equals(new Interval(-5, 20))).toBe(true);
  expect(i3.Union(new Interval(-5, 5)).Equals(new Interval(-5, 5))).toBe(true);
  expect(i4.Union(new Interval(-5, 5)).Equals(new Interval(-5, 5))).toBe(true);
});

test('Intersect', () => {
  expect(i1.Intersect(new Interval(-5, 5)).Equals(new Interval(-5, 5))).toBe(true);
  expect(i2.Intersect(new Interval(-5, 5)).Equals(new Interval(0, 5))).toBe(true);
  expect(i3.Intersect(new Interval(-5, 5)).Equals(new Interval(0, 0))).toBe(true);
  expect(i4.Intersect(new Interval(-5, 5)).Equals(new Interval(-5, 5))).toBe(true);
});

import { Open3d } from './Open3d';
import { Open3dMath } from './Open3dMath';

/**
 * Represents an interval in one-dimensional space that is defined as two extrema or bounds.
 */
export class Interval {
  private t0: number;
  private t1: number;

  // #region Constructors

  /**
   * Initializes a new instance of the Interval class.
   * @param t0 The first bound of the interval.
   * @param t1 The second bound of the interval.
   */
  constructor(t0: number, t1: number) {
    this.t0 = t0;
    this.t1 = t1;
  }

  /**
   * Initializes a new instance copying the other instance values.
   * @param other
   * @returns
   */
  public static CreateFromInternal(other: Interval): Interval {
    return new Interval(other.t0, other.t1);
  }

  /**
   * returns an empty interval that goes from 0 to 0.
   */
  public static get Empty(): Interval {
    return new Interval(0, 0);
  }

  /**
   * returns an invalid interval that goes from NaN to NaN.
   * @remarks An invalid interval is not valid and cannot be used for any calculations.
   */
  public static get Invalid(): Interval {
    return new Interval(NaN, NaN);
  }

  // #endregion

  //#region Properties

  /**
   * Gets a value indicating whether or not this Interval is valid. Valid intervals must contain valid numbers.
   */
  public get IsValid(): boolean {
    return Open3dMath.IsValidNumber(this.t0) && Open3dMath.IsValidNumber(this.t1);
  }

  /**
   * Gets or sets the lower bound of the Interval.
   */
  public get T0(): number {
    return this.t0;
  }

  /**
   * Gets or sets the lower bound of the Interval.
   */
  public set T0(value: number) {
    this.t0 = value;
  }

  /**
   * Gets or sets the upper bound of the Interval.
   */
  public get T1(): number {
    return this.t1;
  }

  /**
   * Gets or sets the upper bound of the Interval.
   */
  public set T1(value: number) {
    this.t1 = value;
  }

  /**
   * Gets the smaller of T0 and T1.
   * If the interval is not valid, NaN is returned.
   */
  public get Min(): number {
    if (!this.IsValid) return NaN;

    return Math.min(this.t0, this.t1);
  }

  /**
   * Gets the larger of T0 and T1.
   * If the interval is not valid, NaN is returned.
   */
  public get Max(): number {
    if (!this.IsValid) return NaN;
    return Math.max(this.t0, this.t1);
  }

  /**
   * Gets the average of T0 and T1.
   * If the interval is not valid, NaN is returned.
   */
  public get Mid(): number {
    if (!this.IsValid) return NaN;
    return (this.t0 + this.t1) / 2;
  }

  /**
   * Gets the signed length of the numeric range.
   * If the interval is not valid, 0 is returned.
   * @remarks If the interval is decreasing, a negative length will be returned.
   */
  public get Length(): number {
    if (!this.IsValid) return 0;
    return this.t1 - this.t0;
  }

  /**
   * Returns true if T0 == T1.
   */
  public get IsSingleton(): boolean {
    return Open3dMath.EpsilonEquals(this.t0, this.t1);
  }

  /**
   * Returns true if T0 < T1.
   */
  public get IsIncreasing(): boolean {
    if (!this.IsValid) return false;
    return this.t0 < this.t1;
  }

  /**
   * Returns true if T0 > T1.
   */
  public get IsDecreasing(): boolean {
    if (!this.IsValid) return false;
    return this.t0 > this.t1;
  }
  // #endregion

  // #region Methods

  /**
   * Determines whether the specified interval is equal to the current interval,
   */
  public Equals(other: Interval): boolean {
    return this.EpsilonEquals(other);
  }

  /**
   * Clones this instance and returns a new Interval.
   * @returns A new Interval with the same values as this instance.
   */
  public Clone(): Interval {
    return new Interval(this.t0, this.t1);
  }

  /**
   * Returns a ensured increasing interval.
   */
  public MakeIncreasing(): Interval {
    if (!this.IsValid) return Interval.Empty;
    if (this.IsIncreasing) return this.Clone();
    return this.Swap();
  }

  /**
   * Exchanges T0 and T1.
   * @returns A new Interval with T0 and T1 swapped.
   */
  public Swap(): Interval {
    return new Interval(this.t1, this.t0);
  }

  /**
   * Changes interval to [-T1, -T0].
   * @returns A new Interval with [-T1, -T0].
   * @remarks If the interval is not valid, an empty interval will be returned.
   */
  public Reverse(): Interval {
    if (!this.IsValid) return Interval.Empty;
    return new Interval(-this.t1, -this.t0);
  }

  /**
   * Grows the interval to include the given number.
   * @param value Number to include in this interval.
   * @returns A new Interval that includes the given number.
   */
  public Grow(value: number): Interval {
    const incresing = this.MakeIncreasing();
    if (incresing.t0 > value) incresing.t0 = value;
    if (incresing.t1 < value) incresing.t1 = value;
    return incresing;
  }

  /**
   * Converts normalized parameter to interval value, or pair of values.
   * @param normalizedParameter
   * @returns Interval parameter min*(1.0-normalizedParameter) + max*normalizedParameter.
   */
  public ParameterAt(normalizedParameter: number): number {
    if (!this.IsValid) return NaN;
    return this.t0 * (1.0 - normalizedParameter) + this.t1 * normalizedParameter;
  }

  /**
   * Converts normalized parameter to interval value, or pair of values.
   * @param normalizedInterval
   * @returns Interval parameter min*(1.0-normalizedParameter) + max*normalized_paramete.
   */
  public ParameterIntervalAt(normalizedInterval: Interval): Interval {
    if (!this.IsValid) return Interval.Invalid;
    return new Interval(this.ParameterAt(normalizedInterval.t0), this.ParameterAt(normalizedInterval.t1));
  }

  /**
   * Converts interval value, or pair of values, to normalized parameter.
   * @param intervalParameter
   * @returns Normalized parameter x so that min*(1.0-x) + max*x = intervalParameter.
   */
  public NormalizedParameterAt(intervalParameter: number): number {
    if (!this.IsValid) return NaN;
    if (Open3dMath.EpsilonEquals(this.t0, this.t1)) return this.t0;
    return (intervalParameter - this.t0) / (this.t1 - this.t0);
  }

  /**
   * Converts interval value, or pair of values, to normalized parameter.
   * @param intervalParameter
   * @returns Normalized parameter x so that min*(1.0-x) + max*x = intervalParameter.
   */
  public NormalizedIntervalAt(intervalParameter: Interval): Interval {
    if (!this.IsValid) return Interval.Invalid;
    return new Interval(this.NormalizedParameterAt(intervalParameter.t0), this.NormalizedParameterAt(intervalParameter.t1));
  }

  /**
   * Tests a parameter for Interval inclusion.
   * @param parameter
   * @param strict If true, the parameter must be fully on the inside of the Interval. default is false.
   * @returns true if t is contained within the limits of this Interval.
   */
  public IncludesParameter(parameter: number, strict: boolean = false): boolean {
    if (!this.IsValid) return false;
    if (strict) {
      if (this.IsIncreasing) return this.t0 < parameter && parameter < this.t1;
      return this.t0 > parameter && parameter > this.t1;
    }
    if (this.IsIncreasing) return this.t0 <= parameter && parameter <= this.t1;
    return this.t0 >= parameter && parameter >= this.t1;
  }

  /**
   * Tests a parameter for Interval inclusion.
   * @param other
   * @param strict If true, the parameter must be fully on the inside of the Interval. default is false.
   * @returns true if the other interval is contained within or is coincident with the limits of this Interval; otherwise false.
   */
  public IncludesInterval(other: Interval, strict: boolean = false): boolean {
    if (!this.IsValid || !other.IsValid) return false;
    return this.IncludesParameter(other.t0, strict) && this.IncludesParameter(other.t1, strict);
  }

  /**
   * Union of two intervals.
   * @param other
   * @returns A new Interval that is the union of this and other.
   */
  public Union(other: Interval): Interval {
    return Interval.Union(this, other);
  }

  /**
   * Intersection of two intervals.
   * @param other
   * @returns A new Interval that is the intersection of this and other.
   */
  public Intersect(other: Interval): Interval {
    return Interval.Intersect(this, other);
  }

  /**
   * Check that all values in other are within epsilon of the values in this
   * @returns
   */
  public EpsilonEquals(other: Interval, epsilon: number = Open3d.EPSILON): boolean {
    if (!this.IsValid || !other.IsValid) return false;
    return Open3dMath.EpsilonEquals(this.t0, other.t0, epsilon) && Open3dMath.EpsilonEquals(this.t1, other.t1, epsilon);
  }

  public ToString(): string {
    return `Interval(${this.t0}, ${this.t1})`;
  }
  // #endregion

  // #region Operators
  /**
   * Shifts a interval by a specific amount (addition).
   * @param value
   * @returns >A new interval where T0 and T1 are summed with number.
   */
  public Add(value: number): Interval {
    return new Interval(this.t0 + value, this.t1 + value);
  }

  /**
   * Shifts an interval by a specific amount (subtraction).
   * @param value
   * @returns A new interval with [T0-number, T1-number].
   */
  public Subtract(value: number): Interval {
    return new Interval(this.t0 - value, this.t1 - value);
  }

  /**
   * Check if the interval is less than another interval.
   * @param other
   * @returns
   */
  public LessThan(other: Interval): boolean {
    return this.CompareTo(other) < 0;
  }

  /**
   * Determines whether the first specified Interval comes before (has inferior sorting value than) the second Interval, or is equal to it.
   * @param other
   * @returns
   */
  public LessThanOrEqual(other: Interval): boolean {
    return this.CompareTo(other) <= 0;
  }

  /**
   * Check if the interval is greater than another interval.
   * @param other
   * @returns
   */
  public GreaterThan(other: Interval): boolean {
    return this.CompareTo(other) > 0;
  }

  /**
   * Determines whether the first specified Interval comes after (has superior sorting value than) the second Interval, or is equal to it.
   * @param other
   * @returns
   */
  public GreaterThanOrEqual(other: Interval): boolean {
    return this.CompareTo(other) >= 0;
  }

  /**
   * Compares this interval with another interval.
   * The lower bound has first evaluation priority.
   * @param other
   * @returns 0: if this is identical to other; -1: if this is less than other; 1: if this is greater than other.
   * @remarks if either interval is invalid, the comparison is invalid and returns NaN.
   */
  public CompareTo(other: Interval): number {
    if (!this.IsValid || !other.IsValid) return NaN;
    if (this.t0 < other.t0) return -1;
    if (this.t0 > other.t0) return 1;
    if (this.t1 < other.t1) return -1;
    if (this.t1 > other.t1) return 1;
    return 0;
  }

  // #endregion

  // #region Static Methods
  /**
   * Union of two intervals.
   * @param a
   * @param b
   * @returns a new Interval that is the union of a and b.
   */
  public static Union(a: Interval, b: Interval): Interval {
    if (!a.IsValid && !b.IsValid) return Interval.Invalid;
    if (!a.IsValid) return b.MakeIncreasing();
    if (!b.IsValid) return a.MakeIncreasing();
    a = a.MakeIncreasing();
    b = b.MakeIncreasing();
    return new Interval(Math.min(a.t0, b.t0), Math.max(a.t1, b.t1));
  }

  /**
   * Intersection of two intervals.
   * @param a
   * @param b
   * @returns a new Interval that is the intersection of a and b.
   */
  public static Intersect(a: Interval, b: Interval): Interval {
    if (!a.IsValid && !b.IsValid) return Interval.Invalid;
    if (!a.IsValid) return b.MakeIncreasing();
    if (!b.IsValid) return a.MakeIncreasing();
    a = a.MakeIncreasing();
    b = b.MakeIncreasing();
    return new Interval(Math.max(a.t0, b.t0), Math.min(a.t1, b.t1));
  }

  // #endregion
}

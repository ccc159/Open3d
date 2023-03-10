import { Point3d } from './Point3d';

/**
 * Represents a list of generic data. This class is similar to javascript arrays.
 */
export class List<T> extends Array<T> {
  /**
   * Gets the number of elements actually contained in the List.
   */
  public get Count(): number {
    return this.length;
  }

  /**
   * Gets or sets the first item in the list. This is synonymous to calling List[0].
   */
  public get First(): T {
    return this[0];
  }

  /**
   * Gets or sets the first item in the list. This is synonymous to calling List[0].
   */
  public set First(value: T) {
    this[0] = value;
  }

  /**
   * Gets or sets the last item in the list. This is synonymous to calling List[Count-1].
   */
  public get Last(): T {
    return this[this.length - 1];
  }

  /**
   * Gets or sets the last item in the list. This is synonymous to calling List[Count-1].
   */
  public set Last(value: T) {
    this[this.length - 1] = value;
  }

  /**
   * Removes all elements from the List.
   */
  public Clear(): void {
    this.length = 0;
  }

  /**
   * Gets the number of null or undefined in this list.
   */
  public get NullOrUndefinedCount(): number {
    return this.filter((x) => x === null || x === undefined).length;
  }
}

/**
 * Represents a list of Point3d objects.
 */

export class Point3dList extends List<Point3d> {}

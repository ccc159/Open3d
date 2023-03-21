import { Point3d } from './Point3d';
import { BoundingBox } from './BoundingBox';

/**
 * Represents a list of generic data. This class is similar to javascript arrays.
 */
export class List<T> {
  /**
   * The internal array of items.
   */
  protected items: T[];

  /**
   * Initializes a new list with the given initial items.
   * @param _items The initial items in the list.
   */
  public constructor(_items: T[] | undefined = undefined) {
    if (_items === undefined) this.items = [];
    else this.items = _items;
  }

  /**
   * Gets the element at the specified index.
   */
  public Get(index: number): T {
    return this.items[index];
  }

  /**
   * Sets the element at the specified index.
   */
  public Set(index: number, value: T): void {
    this.items[index] = value;
  }

  /**
   * Gets the number of elements actually contained in the List.
   */
  public get Count(): number {
    return this.items.length;
  }

  /**
   * Gets or sets the first item in the list. This is synonymous to calling List[0].
   */
  public get First(): T {
    return this.items[0];
  }

  /**
   * Gets or sets the first item in the list. This is synonymous to calling List[0].
   */
  public set First(value: T) {
    this.items[0] = value;
  }

  /**
   * Gets or sets the last item in the list. This is synonymous to calling List[Count-1].
   */
  public get Last(): T {
    return this.items[this.Count - 1];
  }

  /**
   * Gets or sets the last item in the list. This is synonymous to calling List[Count-1].
   */
  public set Last(value: T) {
    this.items[this.Count - 1] = value;
  }

  /**
   * Removes all elements from the List.
   */
  public Clear(): void {
    this.items.length = 0;
  }

  /**
   * Adds an object to the end of the List.
   * Equivalent to the javascript Array.push method.
   * @param item The object to be added to the end of the List.
   */
  public Add(item: T): void {
    this.items.push(item);
  }

  /**
   * Adds an array of items to the end of the List.
   * @param items The array of items to be added to the end of the List.
   */
  public AddRange(items: T[]): void {
    this.items.push(...items);
  }

  /**
   * Equivalent to the javascript Array.includes method.
   */
  public Contains(item: T, fromIndex?: number): boolean {
    return this.items.includes(item, fromIndex);
  }

  /**
   * Equivalent to the javascript Array.some method.
   */
  public Exists(predicate: (value: T, index: number, obj: T[]) => boolean): boolean {
    return this.items.some(predicate);
  }

  /**
   * Equivalent to the javascript Array.find method.
   */
  public Find(predicate: (value: T, index: number, obj: T[]) => boolean): T | undefined {
    return this.items.find(predicate);
  }

  /**
   * Equivalent to the javascript Array.findIndex method.
   */
  public FindIndex(predicate: (value: T, index: number, obj: T[]) => boolean): number {
    return this.items.findIndex(predicate);
  }

  /**
   * Equivalent to the javascript Array.filter method.
   */
  public FindAll(predicate: (value: T, index: number, obj: T[]) => boolean): T[] {
    return this.items.filter(predicate);
  }

  /**
   * Equivalent to the javascript Array.forEach method.
   */
  public ForEach(callbackfn: (value: T, index: number, array: T[]) => void): void {
    this.items.forEach(callbackfn);
  }

  /**
   * Adds a item to a specific index in the list.
   * @param index The zero-based index at which item should be inserted.
   * @param item The item to insert.
   */
  public Insert(index: number, item: T): void {
    this.items.splice(index, 0, item);
  }

  /**
   * Adds an array of items to a specific index in the list.
   * @param index The zero-based index at which items should be inserted.
   * @param items The items to insert.
   */
  public InsertRange(index: number, items: T[]): void {
    this.items.splice(index, 0, ...items);
  }

  /**
   * Gets the number of null or undefined in this list.
   */
  public get NullOrUndefinedCount(): number {
    return this.items.filter((x) => x === null || x === undefined).length;
  }

  /**
   * Equivalent to the javascript Array.reduce method.
   */
  public Reduce(callbackfn: (previousValue: T, currentValue: T, currentIndex: number, array: T[]) => T): T {
    return this.items.reduce(callbackfn);
  }

  /**
   * Equivalent to the javascript Array.pop method.
   */
  public Pop(): T | undefined {
    return this.items.pop();
  }

  /**
   * Equivalent to the javascript Array.shift method.
   */
  public Shift(): T | undefined {
    return this.items.shift();
  }

  /**
   * Equivalent to the javascript Array.filter method.
   */
  public Filter(predicate: (value: T, index: number, obj: T[]) => boolean): T[] {
    return this.items.filter(predicate);
  }

  /**
   * A wrapper around the javascript Array.map method.
   */
  public Map<S>(callbackfn: (value: T, index: number, array: T[]) => S): S[] {
    return this.items.map<S>(callbackfn);
  }

  /**
   * Removes the first occurrence of a specific object from the List.
   */
  public Remove(item: T): void {
    const index = this.items.indexOf(item);
    if (index > -1) {
      this.items.splice(index, 1);
    }
  }

  /**
   * Removes the first item that matches the given predicate.
   * @param predicate
   */
  public RemoveBy(predicate: (value: T, index: number, obj: T[]) => boolean): void {
    const item = this.Find(predicate);
    if (item) this.Remove(item);
  }

  /**
   * Removes all items that match the given predicate.
   * @param predicate
   */
  public RemoveAll(predicate: (value: T, index: number, obj: T[]) => boolean): void {
    const itemsToRemove = this.items.filter(predicate);
    itemsToRemove.forEach((item) => this.Remove(item));
  }

  /**
   * Equivalent to the javascript Array.sort method.
   */
  public Sort(compareFn?: (a: T, b: T) => number): void {
    this.items.sort(compareFn);
  }

  /**
   * Reverse the order of the items in the list.
   * @remarks This method mutates the list and returns a reference.
   * @returns The reversed list.
   */
  public Reverse(): T[] {
    return this.items.reverse();
  }
}

/**
 * Represents a list of Point3d objects.
 */

export class Point3dList extends List<Point3d> {
  /**
   * Even though this is a property, it is not a "fast" calculation. Every point is evaluated in order to get the bounding box of the list.
   */
  public get BoundingBox(): BoundingBox {
    if (this.Count === 0) return BoundingBox.Empty;
    let minX = Number.MAX_VALUE;
    let minY = Number.MAX_VALUE;
    let minZ = Number.MAX_VALUE;
    let maxX = Number.MIN_VALUE;
    let maxY = Number.MIN_VALUE;
    let maxZ = Number.MIN_VALUE;

    for (const p of this.items) {
      minX = Math.min(minX, p.X);
      minY = Math.min(minY, p.Y);
      minZ = Math.min(minZ, p.Z);
      maxX = Math.max(maxX, p.X);
      maxY = Math.max(maxY, p.Y);
      maxZ = Math.max(maxZ, p.Z);
    }

    return new BoundingBox(minX, minY, minZ, maxX, maxY, maxZ);
  }
}

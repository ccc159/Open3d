import { Point3d } from './Point3d';
/**
 * Represents a list of generic data. This class is similar to javascript arrays.
 */
export declare class List<T> {
    /**
     * The internal array of items.
     */
    protected items: T[];
    /**
     * Initializes a new list with the given initial items.
     * @param _items The initial items in the list.
     */
    constructor(_items?: T[] | undefined);
    /**
     * Gets the element at the specified index.
     */
    Get(index: number): T;
    /**
     * Sets the element at the specified index.
     */
    Set(index: number, value: T): void;
    /**
     * Gets the number of elements actually contained in the List.
     */
    get Count(): number;
    /**
     * Gets or sets the first item in the list. This is synonymous to calling List[0].
     */
    get First(): T;
    /**
     * Gets or sets the first item in the list. This is synonymous to calling List[0].
     */
    set First(value: T);
    /**
     * Gets or sets the last item in the list. This is synonymous to calling List[Count-1].
     */
    get Last(): T;
    /**
     * Gets or sets the last item in the list. This is synonymous to calling List[Count-1].
     */
    set Last(value: T);
    /**
     * Removes all elements from the List.
     */
    Clear(): void;
    /**
     * Adds an object to the end of the List.
     * Equivalent to the javascript Array.push method.
     * @param item The object to be added to the end of the List.
     */
    Add(item: T): void;
    /**
     * Adds an array of items to the end of the List.
     * @param items The array of items to be added to the end of the List.
     */
    AddRange(items: T[]): void;
    /**
     * Equivalent to the javascript Array.includes method.
     */
    Contains(item: T, fromIndex?: number): boolean;
    /**
     * Equivalent to the javascript Array.some method.
     */
    Exists(predicate: (value: T, index: number, obj: T[]) => boolean): boolean;
    /**
     * Equivalent to the javascript Array.find method.
     */
    Find(predicate: (value: T, index: number, obj: T[]) => boolean): T | undefined;
    /**
     * Equivalent to the javascript Array.findIndex method.
     */
    FindIndex(predicate: (value: T, index: number, obj: T[]) => boolean): number;
    /**
     * Equivalent to the javascript Array.filter method.
     */
    FindAll(predicate: (value: T, index: number, obj: T[]) => boolean): T[];
    /**
     * Equivalent to the javascript Array.forEach method.
     */
    ForEach(callbackfn: (value: T, index: number, array: T[]) => void): void;
    /**
     * Adds a item to a specific index in the list.
     * @param index The zero-based index at which item should be inserted.
     * @param item The item to insert.
     */
    Insert(index: number, item: T): void;
    /**
     * Adds an array of items to a specific index in the list.
     * @param index The zero-based index at which items should be inserted.
     * @param items The items to insert.
     */
    InsertRange(index: number, items: T[]): void;
    /**
     * Gets the number of null or undefined in this list.
     */
    get NullOrUndefinedCount(): number;
    /**
     * Equivalent to the javascript Array.reduce method.
     */
    Reduce(callbackfn: (previousValue: T, currentValue: T, currentIndex: number, array: T[]) => T): T;
    /**
     * Equivalent to the javascript Array.pop method.
     */
    Pop(): T | undefined;
    /**
     * Equivalent to the javascript Array.shift method.
     */
    Shift(): T | undefined;
    /**
     * Equivalent to the javascript Array.filter method.
     */
    Filter(predicate: (value: T, index: number, obj: T[]) => boolean): T[];
    /**
     * A wrapper around the javascript Array.map method.
     */
    Map<S>(callbackfn: (value: T, index: number, array: T[]) => S): S[];
    /**
     * Removes the first occurrence of a specific object from the List.
     */
    Remove(item: T): void;
    /**
     * Removes the first item that matches the given predicate.
     * @param predicate
     */
    RemoveBy(predicate: (value: T, index: number, obj: T[]) => boolean): void;
    /**
     * Removes all items that match the given predicate.
     * @param predicate
     */
    RemoveAll(predicate: (value: T, index: number, obj: T[]) => boolean): void;
    /**
     * Equivalent to the javascript Array.sort method.
     */
    Sort(compareFn?: (a: T, b: T) => number): void;
    /**
     * Reverse the order of the items in the list.
     * @remarks This method mutates the list and returns a reference.
     * @returns The reversed list.
     */
    Reverse(): T[];
}
/**
 * Represents a list of Point3d objects.
 */
export declare class Point3dList extends List<Point3d> {
}

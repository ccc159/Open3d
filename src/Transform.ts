import { Open3d } from './Open3d';
import { Open3dMath } from './Open3dMath';
import { Plane } from './Plane';
import { Point3d } from './Point3d';
import { Vector3d } from './Vector3d';

/**
 * a type that has an array of 16 numbers
 */
export type Array16Number = [number, number, number, number, number, number, number, number, number, number, number, number, number, number, number, number];

/**
 * Represents the values in a 4x4 transform matrix.
 */
export class Transform {
  private m: Array16Number;

  /**
   * Create a new matrix from an array of 16 values.
   * @param m Value to assign to the matrix using [n11, n21, n31, n41, n12, n22, n32, n42, n13, n23, n33, n43, n14, n24, n34, n44] format.
   */
  constructor(m: Array16Number) {
    this.m = m;
  }

  // #region Properties

/**
   * Returns the determinant of the submatrix specified by the indices.
   * @param rowIndex row index
   * @param columnIndex column index
   */
private SubMatrixDeterminant(rowIndex: 0 | 1 | 2 | 3, columnIndex: 0 | 1 | 2 | 3) {
  /**
   * | a b c |
   * | d e f | = aei + bfg + cdh - ceg - bdi - afh
   * | g h i |
   */

  const is = [0, 1, 2, 3].filter((x) => x !== rowIndex);
  const js = [0, 1, 2, 3].filter((x) => x !== columnIndex);

  const a = this.M[is[0] * 4 + js[0]];
  const b = this.M[is[0] * 4 + js[1]];
  const c = this.M[is[0] * 4 + js[2]];

  const d = this.M[is[1] * 4 + js[0]];
  const e = this.M[is[1] * 4 + js[1]];
  const f = this.M[is[1] * 4 + js[2]];

  const g = this.M[is[2] * 4 + js[0]];
  const h = this.M[is[2] * 4 + js[1]];
  const i = this.M[is[2] * 4 + js[2]];

  return a * e * i + b * f * g + c * d * h - c * e * g - b * d * i - a * f * h;
}


  /**
   * The determinant of this 4x4 matrix.
   */
  public get Determinant(): number {
    return (
      this.m[0] * this.SubMatrixDeterminant(0, 0)
      - this.m[1] * this.SubMatrixDeterminant(0, 1)
      + this.m[2] * this.SubMatrixDeterminant(0, 2)
      - this.m[3] * this.SubMatrixDeterminant(0, 3)
    );
  }

  /**
   * Gets the transformation array.
   */
  public get M(): Array16Number {
    return this.ToArray();
  }

  /**
   * Gets a new identity transform matrix. An identity matrix defines no transformation.
   */
  public static get Identity(): Transform {
    return new Transform([1, 0, 0, 0, 0, 1, 0, 0, 0, 0, 1, 0, 0, 0, 0, 1]);
  }

  /**
   * Return true if this Transform is the identity transform
   */
  public get IsIdentity(): boolean {
    return this.Equals(Transform.Identity);
  }

  /**
   * ZeroTransformation diagonal = (0,0,0,1)
   */
  public static get ZeroTransformation(): Transform {
    return new Transform([0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 1]);
  }

  /**
   * 	True if all values are 0, except for M33 which is 1.
   */
  public get IsZeroTransformation(): boolean {
    return this.Equals(Transform.ZeroTransformation);
  }

  // #endregion

  // #region Methods

  /**
   * Determines if another transform equals this transform value.
   * @param other The transform to compare.
   */
  public Equals(other: Transform): boolean {
    const te = this.M;
    const me = other.M;

    for (let i = 0; i < 16; i++) {
      if (!Open3dMath.EpsilonEquals(te[i], me[i])) return false;
    }

    return true;
  }

  /**
   * Returns a copy of the transform.
   */
  public Clone(): Transform {
    return new Transform(this.M);
  }

  /**
   * Returns the transform as an array.
   */
  public ToArray(): Array16Number {
    return [...this.m];
  }

  /**
   * Multiplies (combines) two transformations.
   * @param a The first transform.
   * @param b The second transform.
   * @returns The result of the multiplication.
   */
  public static MultiplyMatrix(a: Transform, b: Transform): Transform {
    return new Transform([
      // Row 1
      a.m[0] * b.m[0] + a.m[1] * b.m[4] + a.m[2] * b.m[8] + a.m[3] * b.m[12],
      a.m[0] * b.m[1] + a.m[1] * b.m[5] + a.m[2] * b.m[9] + a.m[3] * b.m[13],
      a.m[0] * b.m[2] + a.m[1] * b.m[6] + a.m[2] * b.m[10] + a.m[3] * b.m[14],
      a.m[0] * b.m[3] + a.m[1] * b.m[7] + a.m[2] * b.m[11] + a.m[3] * b.m[15],
      // Row 2
      a.m[4] * b.m[0] + a.m[5] * b.m[4] + a.m[6] * b.m[8] + a.m[7] * b.m[12],
      a.m[4] * b.m[1] + a.m[5] * b.m[5] + a.m[6] * b.m[9] + a.m[7] * b.m[13],
      a.m[4] * b.m[2] + a.m[5] * b.m[6] + a.m[6] * b.m[10] + a.m[7] * b.m[14],
      a.m[4] * b.m[3] + a.m[5] * b.m[7] + a.m[6] * b.m[11] + a.m[7] * b.m[15],
      // Row 3
      a.m[8] * b.m[0] + a.m[9] * b.m[4] + a.m[10] * b.m[8] + a.m[11] * b.m[12],
      a.m[8] * b.m[1] + a.m[9] * b.m[5] + a.m[10] * b.m[9] + a.m[11] * b.m[13],
      a.m[8] * b.m[2] + a.m[9] * b.m[6] + a.m[10] * b.m[10] + a.m[11] * b.m[14],
      a.m[8] * b.m[3] + a.m[9] * b.m[7] + a.m[10] * b.m[11] + a.m[11] * b.m[15],
      // Row 4
      a.m[12] * b.m[0] + a.m[13] * b.m[4] + a.m[14] * b.m[8] + a.m[15] * b.m[12],
      a.m[12] * b.m[1] + a.m[13] * b.m[5] + a.m[14] * b.m[9] + a.m[15] * b.m[13],
      a.m[12] * b.m[2] + a.m[13] * b.m[6] + a.m[14] * b.m[10] + a.m[15] * b.m[14],
      a.m[12] * b.m[3] + a.m[13] * b.m[7] + a.m[14] * b.m[11] + a.m[15] * b.m[15],
    ]);
  }

  /**
   *   Multiplies (combines) two transformations.
   *  @param other The second transform.
   * @returns The result of the multiplication.
   */
  public MultiplyMatrix(other: Transform): Transform {
    return Transform.MultiplyMatrix(this, other);
  }

  /**
   * Multiplies a transformation by a scalar.
   * @param a The transform.
   * @param s The scalar.
   * @returns The result of the multiplication.
   */
  public static MultiplyScalar(a: Transform, s: number): Transform {
    const te = a.M;

    for (let i = 0; i < 16; i++) {
      te[i] *= s;
    }

    return new Transform(te);
  }

  /**
   *   Multiplies a transformation by a scalar.
   *  @param scalar The scalar.
   * @returns The result of the multiplication.
   */
  public MultiplyScalar(scalar: number): Transform {
    return Transform.MultiplyScalar(this, scalar);
  }

  // #endregion

  /**
   * Constructs a new rotation transformation with specified angle and rotation axis.
   * @param angle Angle (in Radians) of the rotation.
   * @param rotationAxis The axis to ratate around, default Vector3D.ZAxis
   * @param rotationCenter The center of the rotation, default (0,0,0).
   */
  public static Rotation(angle: number, rotationAxis: Vector3d = Vector3d.ZAxis, rotationCenter: Point3d = Point3d.Origin): Transform {
    // convert point to vector
    const vec = Vector3d.CreateFromPoint3d(rotationCenter);

    // move location to world origin
    const m1 = Transform.Translation(vec.Reverse());

    // scale
    const m2 = Transform.RotateAtOrigin(angle, rotationAxis);

    // move back
    const m3 = Transform.Translation(vec);

    // return m1 * m2 * m3
    return Transform.CombineTransforms([m1, m2, m3]);
  }

  /**
   * Constructs a new rotation transformation with specified angle and rotation axis.
   * This function assume the rotation origin is the world origin.
   * @param angle Angle (in Radians) of the rotation.
   * @param axis The axis to ratate around
   */
  public static RotateAtOrigin(angle: number, axis: Vector3d): Transform {
    const c = Math.cos(angle);
    const s = Math.sin(angle);
    const t = 1 - c;

    if (axis.IsZero) throw new Error('Rotation axis should not be zero vector.');
    axis = axis.Unitize();

    const x = axis.X,
      y = axis.Y,
      z = axis.Z;
    const tx = t * x,
      ty = t * y;

    return new Transform([tx * x + c, tx * y - s * z, tx * z + s * y, 0, tx * y + s * z, ty * y + c, ty * z - s * x, 0, tx * z - s * y, ty * z + s * x, t * z * z + c, 0, 0, 0, 0, 1]);
  }

  /**
   * Constructs a new rotation transformation that rotates around X axis.
   * this is also called "roll"
   * @param angle Angle (in Radians) of the rotation.
   */
  public static RotationX(angle: number): Transform {
    return Transform.Rotation(angle, Vector3d.XAxis);
  }

  /**
   * Constructs a new rotation transformation that rotates around Y axis.
   * this is also called "pitch"
   * @param angle Angle (in Radians) of the rotation.
   */
  public static RotationY(angle: number): Transform {
    return Transform.Rotation(angle, Vector3d.YAxis);
  }

  /**
   * Constructs a new rotation transformation that rotates around Z axis.
   * this is also called "yaw"
   * @param angle Angle (in Radians) of the rotation.
   */
  public static RotationZ(angle: number): Transform {
    return Transform.Rotation(angle, Vector3d.ZAxis);
  }

  /**
   * Create rotation transformation From ZYX angles.
   *
   * @param z Yaw: Angle in radians to rotate around Z axis.
   * @param y Pitch: Angle in radians to rotate around Y axis.
   * @param x Roll: Angle in radians to rotate around X axis.
   */
  public static RotationZYX(z: number, y: number, x: number): Transform {
    const yaw = Transform.RotationZ(z);
    const pitch = Transform.RotationY(y);
    const roll = Transform.RotationX(x);

    // notice the order of transforms
    return Transform.CombineTransforms([roll, pitch, yaw]);
  }

  /**
   * Constructs a new translation (move) transformation.
   * a translation matrix looks like
   * [ 1 0 0 tx]
   * [ 0 1 0 ty]
   * [ 0 0 1 tz]
   * [ 0 0 0  1]
   * @param v The vector to scale by
   * @returns The translated transform
   */
  public static Translation(v: Vector3d) {
    return new Transform([1, 0, 0, v.X, 0, 1, 0, v.Y, 0, 0, 1, v.Z, 0, 0, 0, 1]);
  }

  /**
   * Constructs a new uniform scaling transformation with a specified scaling anchor point.
   * @param location The location to scale from
   * @param scalar The scaling factor
   * @returns The scaled transform
   */
  public static Scale(location: Point3d, scalar: number) {
    // convert point to vector
    const vec = Vector3d.CreateFromPoint3d(location);

    // move location to origin
    const m1 = Transform.Translation(vec.Reverse());

    // scale
    const m2 = Transform.ScaleAtOrigin(scalar, scalar, scalar);

    // move back
    const m3 = Transform.Translation(vec);

    // return m1 * m2 * m3
    return Transform.CombineTransforms([m1, m2, m3]);
  }

  /**
   * Constructs a new transform by combining given transforms in order
   * Note: as transforms multiplication is not commutative, the order matters.
   * If none given, identity transform is returned.
   * @param transforms The transforms array.
   * @returns The combined transform.
   */
  public static CombineTransforms(transforms: Transform[]): Transform {
    const xforms = [...transforms];
    xforms.reverse();
    let m = Transform.Identity;
    for (let i = 0; i < xforms.length; i++) {
      m = m.MultiplyMatrix(xforms[i]);
    }
    return m;
  }

  /**
   * Constructs a new uniform scaling transformation.
   * a sacle matrix looks like
   * [ sx 0  0  0]
   * [ 0  sy 0  0]
   * [ 0  0  sz 0]
   * [ 0  0  0  1]
   * @param sx The scaling factor in the x dimension
   * @param sy The scaling factor in the y dimension
   * @param sz The scaling factor in the z dimension
   * @returns The scaled transform
   */
  public static ScaleAtOrigin(sx: number, sy: number, sz: number) {
    return new Transform([sx, 0, 0, 0, 0, sy, 0, 0, 0, 0, sz, 0, 0, 0, 0, 1]);
  }

  /**
   * Constructs a projection transformation.
   * @param plane Plane onto which everything will be perpendicularly projected.
   * @returns A transformation matrix which projects geometry onto a specified plane.
   */
  public static PlanarProjection(plane: Plane) {
    let x = plane.XAxis;
    let y = plane.YAxis;
    let p = plane.Origin;

    const n11 = x.X * x.X + y.X * y.X;
    const n12 = x.X * x.Y + y.X * y.Y;
    const n13 = x.X * x.Z + y.X * y.Z;

    const n21 = x.Y * x.X + y.Y * y.X;
    const n22 = x.Y * x.Y + y.Y * y.Y;
    const n23 = x.Y * x.Z + y.Y * y.Z;

    const n31 = x.Z * x.X + y.Z * y.X;
    const n32 = x.Z * x.Y + y.Z * y.Y;
    const n33 = x.Z * x.Z + y.Z * y.Z;

    const n41 = 0.0;
    const n14 = p.X - n11 * p.X + n12 * p.Y + n13 * p.Z;

    const n42 = 0.0;
    const n24 = p.Y - n21 * p.X + n22 * p.Y + n23 * p.Z;

    const n43 = 0.0;
    const n34 = p.Z - n31 * p.X + n32 * p.Y + n33 * p.Z;

    const n44 = 1;

    return new Transform([n11, n12, n13, n14, n21, n22, n23, n24, n31, n32, n33, n34, n41, n42, n43, n44]);
  }

  /**
   * Constructs a new Mirror transformation.
   * @param plane Plane that defines the mirror orientation and position.
   * @returns A transformation matrix which mirrors geometry in a specified plane.
   */
  public static Mirror(plane: Plane) {
    const equation = plane.Equation;
    const n = plane.Normal;

    const v = n.Multiply(-2.0 * equation[3]);

    const n11 = 1.0 - 2.0 * n.X * n.X;
    const n12 = -2.0 * n.X * n.Y;
    const n13 = -2.0 * n.X * n.Z;
    const n14 = v.X;

    const n21 = -2.0 * n.Y * n.X;
    const n22 = 1.0 - 2.0 * n.Y * n.Y;
    const n23 = -2.0 * n.Y * n.Z;
    const n24 = v.Y;

    const n31 = -2.0 * n.Z * n.X;
    const n32 = -2.0 * n.Z * n.Y;
    const n33 = 1.0 - 2.0 * n.Z * n.Z;
    const n34 = v.Z;

    const n41 = 0.0;
    const n42 = 0.0;
    const n43 = 0.0;
    const n44 = 1.0;

    return new Transform([n11, n12, n13, n14, n21, n22, n23, n24, n31, n32, n33, n34, n41, n42, n43, n44]);
  }

  /**
   * Constructs a rotation transformation that rotates one vecor to another
   * @param fromVector the from vector
   * @param toVector the to vector
   * @returns A rotation matrix which rotates fromVector to toVector
   */
  public static VectorToVector(fromVector: Vector3d, toVector: Vector3d) {
    const rotationAxis = toVector.CrossProduct(fromVector);

    let rotationAngle = Vector3d.VectorAngle(fromVector, toVector);

    return Transform.RotateAtOrigin(-rotationAngle, rotationAxis);
  }

  /**
   * WorldXY to Frame transformation
   * @param origin origin of the frame
   * @param xAxis x axis of the frame
   * @param yAxis y axis of the frame
   * @param zAxis z axis of the frame
   * @returns the transformation matrix
   */
    static worldXYToFrame(origin: Point3d, xAxis: Vector3d, yAxis: Vector3d, zAxis: Vector3d): Transform {
    return new Transform([xAxis.X, yAxis.X, zAxis.X, origin.X, xAxis.Y, yAxis.Y, zAxis.Y, origin.Y, xAxis.Z, yAxis.Z, zAxis.Z, origin.Z, 0, 0, 0, 1]);
  }

  /**
   * Helper method to map a point through an arbitrary Frame to an arbitray Frame transformation
   * @param origin1 origin of the frame
   * @param xAxis1 x axis of the frame
   * @param yAxis1 y axis of the frame
   * @param zAxis1 z axis of the frame
   * @param origin2 origin of the frame
   * @param xAxis2 x axis of the frame
   * @param yAxis2 y axis of the frame
   * @param zAxis2 z axis of the frame
   * @param point point to be transformed
   * @returns transformed point
   */
  static frameToFramePoint(
    origin1: Point3d,
    xAxis1: Vector3d,
    yAxis1: Vector3d,
    zAxis1: Vector3d,
    origin2: Point3d,
    xAxis2: Vector3d,
    yAxis2: Vector3d,
    zAxis2: Vector3d,
    point: Point3d
  ) {
    const locP = point.SubtractPoint(origin1);
    const xT = locP.DotProduct(xAxis1);
    const yT = locP.DotProduct(yAxis1);
    const zT = locP.DotProduct(zAxis1);

    return origin2.Add(xAxis2.Multiply(xT)).Add(yAxis2.Multiply(yT)).Add(zAxis2.Multiply(zT));
  }

  /**
   * Helper method for creating the transformation for an arbitrary Frame to an arbitrary Frame by mapping xy plane through the transformation
   * @param origin1 origin of the frame
   * @param xAxis1 x axis of the frame
   * @param yAxis1 y axis of the frame
   * @param zAxis1 z axis of the frame
   * @param origin2 origin of the frame
   * @param xAxis2 x axis of the frame
   * @param yAxis2 y axis of the frame
   * @param zAxis2 z axis of the frame
   * @returns transformation matrix
   */
  static frameToFrame(
    origin1: Point3d,
    xAxis1: Vector3d,
    yAxis1: Vector3d,
    zAxis1: Vector3d,
    origin2: Point3d,
    xAxis2: Vector3d,
    yAxis2: Vector3d,
    zAxis2: Vector3d
  ) {
    const o = Transform.frameToFramePoint(origin1, xAxis1, yAxis1, zAxis1, origin2, xAxis2, yAxis2, zAxis2, new Point3d(0, 0, 0));
    const x = Transform.frameToFramePoint(origin1, xAxis1, yAxis1, zAxis1, origin2, xAxis2, yAxis2, zAxis2, new Point3d(1, 0, 0));
    const y = Transform.frameToFramePoint(origin1, xAxis1, yAxis1, zAxis1, origin2, xAxis2, yAxis2, zAxis2, new Point3d(0, 1, 0));
    const z = Transform.frameToFramePoint(origin1, xAxis1, yAxis1, zAxis1, origin2, xAxis2, yAxis2, zAxis2, new Point3d(0, 0, 1));
    return Transform.worldXYToFrame(o, x.SubtractPoint(o), y.SubtractPoint(o), z.SubtractPoint(o));
  }


  /**
   * Create a transformation that orients plane0 to plane1. If you want to orient objects from one plane to another, use this form of transformation.
   * @param fromPlane The plane to orient from.
   * @param toPlane the plane to orient to.
   * @returns A transformation matrix which orients from fromPlane to toPlane
   */
  public static PlaneToPlane(fromPlane: Plane, toPlane: Plane) {
    return Transform.frameToFrame(fromPlane.Origin, fromPlane.XAxis, fromPlane.YAxis, fromPlane.ZAxis, toPlane.Origin, toPlane.XAxis, toPlane.YAxis, toPlane.ZAxis);
  }

  /**
   * Transpose the matrix and return a new one.
   */
  public Transpose() {
    return new Transform([
      this.M[0], this.M[4], this.M[8], this.M[12],
      this.M[1], this.M[5], this.M[9], this.M[13],
      this.M[2], this.M[6], this.M[10], this.M[14],
      this.M[3], this.M[7], this.M[11], this.M[15]
    ]);
  }

  /**
   * Attempts to get the inverse transform of this transform.
   */
  public TryGetInverse(): Transform | null {
    const det = this.Determinant;

    if (det === 0) return null;

    const detInv = 1 / det;

    return new Transform([
      // row 1
      this.SubMatrixDeterminant(0,0) * detInv,
      -this.SubMatrixDeterminant(1,0) * detInv,
      this.SubMatrixDeterminant(2,0) * detInv,
      -this.SubMatrixDeterminant(3,0) * detInv,
      // row 2
      -this.SubMatrixDeterminant(0,1) * detInv,
      this.SubMatrixDeterminant(1,1) * detInv,
      -this.SubMatrixDeterminant(2,1) * detInv,
      this.SubMatrixDeterminant(3,1) * detInv,
      // row 3
      this.SubMatrixDeterminant(0,2) * detInv,
      -this.SubMatrixDeterminant(1,2) * detInv,
      this.SubMatrixDeterminant(2,2) * detInv,
      -this.SubMatrixDeterminant(3,2) * detInv,
      // row 4
      -this.SubMatrixDeterminant(0,3) * detInv,
      this.SubMatrixDeterminant(1,3) * detInv,
      -this.SubMatrixDeterminant(2,3) * detInv,
      this.SubMatrixDeterminant(3,3) * detInv,
    ])
  }

  /**
   * Get scale factor of the Transform
   */
  public get ScaleFactor(): Vector3d {
    return new Vector3d(
      new Vector3d(this.M[0], this.M[1], this.M[2]).Length,
      new Vector3d(this.M[4], this.M[5], this.M[6]).Length,
      new Vector3d(this.M[8], this.M[9], this.M[10]).Length
    )
  }

  /**
   * Get the Transform representing only the scaling of the Transform
   */
  public get ScaleTransform(): Transform {
    const scale = this.ScaleFactor;
    return new Transform([
      scale.X, 0, 0, 0,
      0, scale.Y, 0, 0,
      0, 0, scale.Z, 0,
      0, 0, 0, 1
    ]);
  }

  /**
   * Get Translation vector of the Transform
   */
  public get TranslationVector(): Vector3d {
    return new Vector3d(this.M[3], this.M[7], this.M[11])
  }
  
  /**
   * Get the Transform representing only the translation of the Transform
   */
  public get TranslationTransform(): Transform {
    const t = this.TranslationVector;
    return new Transform([
      1, 0, 0, t.X,
      0, 1, 0, t.Y,
      0, 0, 1, t.Z,
      0, 0, 0, 1
    ]);
  }

  /**
   * Get unit base vectors of the Transform
   */
  public get BaseVectors(): [Vector3d, Vector3d, Vector3d] {
    if (this.Determinant === 0) throw new Error("Non affine transformation")
    return [
      new Vector3d(this.M[0], this.M[1], this.M[2]).Unitize(),
      new Vector3d(this.M[4], this.M[5], this.M[6]).Unitize(),
      new Vector3d(this.M[8], this.M[9], this.M[10]).Unitize()
    ]
  }

  /**
   * Get the transform representing only the unit base vectors of the Transform
   */
  public get BaseTransform(): Transform {
    const [x, y, z] = this.BaseVectors;
    return new Transform([
      x.X, x.Y, x.Z, 0,
      y.X, y.Y, y.Z, 0,
      z.X, z.Y, z.Z, 0,
      0, 0, 0, 1
    ]);
  }

  /**
   * override toString
   */
  public toString(): string {
    const [n11, n21, n31, n41, n12, n22, n32, n42, n13, n23, n33, n43, n14, n24, n34, n44] = this.m;
    return `R0=(${n11}, ${n12}, ${n13}, ${n14}), R1=(${n21}, ${n22}, ${n23}, ${n24}), R2=(${n31}, ${n32}, ${n33}, ${n34}), R3=(${n41}, ${n42}, ${n43}, ${n44})`;
  }
}

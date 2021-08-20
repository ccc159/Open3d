import { Vector3d } from './Vector3d';

/**
 * a type that has an array of 16 numbers
 */
export type Array16Number = [
  number,
  number,
  number,
  number,
  number,
  number,
  number,
  number,
  number,
  number,
  number,
  number,
  number,
  number,
  number,
  number
];

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
   * The determinant of this 4x4 matrix.
   */
  public get Determinant(): number {
    const [n11, n21, n31, n41, n12, n22, n32, n42, n13, n23, n33, n43, n14, n24, n34, n44] = this.m;

    return (
      n41 * (+n14 * n23 * n32 - n13 * n24 * n32 - n14 * n22 * n33 + n12 * n24 * n33 + n13 * n22 * n34 - n12 * n23 * n34) +
      n42 * (+n11 * n23 * n34 - n11 * n24 * n33 + n14 * n21 * n33 - n13 * n21 * n34 + n13 * n24 * n31 - n14 * n23 * n31) +
      n43 * (+n11 * n24 * n32 - n11 * n22 * n34 - n14 * n21 * n32 + n12 * n21 * n34 + n14 * n22 * n31 - n12 * n24 * n31) +
      n44 * (-n13 * n22 * n31 - n11 * n23 * n32 + n11 * n22 * n33 + n13 * n21 * n32 - n12 * n21 * n33 + n12 * n23 * n31)
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
    const te = this.m;
    const me = other.m;

    for (let i = 0; i < 16; i++) {
      if (te[i] !== me[i]) return false;
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
    const ae = a.m;
    const be = b.m;

    const [a11, a21, a31, a41, a12, a22, a32, a42, a13, a23, a33, a43, a14, a24, a34, a44] = ae;
    const [b11, b21, b31, b41, b12, b22, b32, b42, b13, b23, b33, b43, b14, b24, b34, b44] = be;

    let te: Array16Number = Transform.Identity.M;

    te[0] = a11 * b11 + a12 * b21 + a13 * b31 + a14 * b41;
    te[4] = a11 * b12 + a12 * b22 + a13 * b32 + a14 * b42;
    te[8] = a11 * b13 + a12 * b23 + a13 * b33 + a14 * b43;
    te[12] = a11 * b14 + a12 * b24 + a13 * b34 + a14 * b44;

    te[1] = a21 * b11 + a22 * b21 + a23 * b31 + a24 * b41;
    te[5] = a21 * b12 + a22 * b22 + a23 * b32 + a24 * b42;
    te[9] = a21 * b13 + a22 * b23 + a23 * b33 + a24 * b43;
    te[13] = a21 * b14 + a22 * b24 + a23 * b34 + a24 * b44;

    te[2] = a31 * b11 + a32 * b21 + a33 * b31 + a34 * b41;
    te[6] = a31 * b12 + a32 * b22 + a33 * b32 + a34 * b42;
    te[10] = a31 * b13 + a32 * b23 + a33 * b33 + a34 * b43;
    te[14] = a31 * b14 + a32 * b24 + a33 * b34 + a34 * b44;

    te[3] = a41 * b11 + a42 * b21 + a43 * b31 + a44 * b41;
    te[7] = a41 * b12 + a42 * b22 + a43 * b32 + a44 * b42;
    te[11] = a41 * b13 + a42 * b23 + a43 * b33 + a44 * b43;
    te[15] = a41 * b14 + a42 * b24 + a43 * b34 + a44 * b44;

    return new Transform(te);
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

    te[0] *= s;
    te[4] *= s;
    te[8] *= s;
    te[12] *= s;

    te[1] *= s;
    te[5] *= s;
    te[9] *= s;
    te[13] *= s;

    te[2] *= s;
    te[6] *= s;
    te[10] *= s;
    te[14] *= s;

    te[3] *= s;
    te[7] *= s;
    te[11] *= s;
    te[15] *= s;

    return new Transform(te);
  }

  // #endregion

  /**
   * Constructs a new rotation transformation with specified angle and rotation center.
   * @param angle Angle (in Radians) of the rotation.
   * @param axis The axis to ratate around
   */
  public static Rotation(angle: number, axis: Vector3d): Transform {
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

    return new Transform([
      tx * x + c,
      tx * y - s * z,
      tx * z + s * y,
      0,
      tx * y + s * z,
      ty * y + c,
      ty * z - s * x,
      0,
      tx * z - s * y,
      ty * z + s * x,
      t * z * z + c,
      0,
      0,
      0,
      0,
      1,
    ]);
  }

  /**
   * Create rotation transformation From XYZ angles.
   * @param x Angle in radians to rotate around X axis.
   * @param y Angle in radians to rotate around Y axis.
   * @param z Angle in radians to rotate around Z axis.
   */
  public static RotationXYZ(x: number, y: number, z: number): Transform {
    const te = Transform.Identity.M;
    const a = Math.cos(x),
      b = Math.sin(x);
    const c = Math.cos(y),
      d = Math.sin(y);
    const e = Math.cos(z),
      f = Math.sin(z);

    const ae = a * e,
      af = a * f,
      be = b * e,
      bf = b * f;

    te[0] = c * e;
    te[4] = -c * f;
    te[8] = d;

    te[1] = af + be * d;
    te[5] = ae - bf * d;
    te[9] = -b * c;

    te[2] = bf - ae * d;
    te[6] = be + af * d;
    te[10] = a * c;

    // bottom row
    te[3] = 0;
    te[7] = 0;
    te[11] = 0;

    // last column
    te[12] = 0;
    te[13] = 0;
    te[14] = 0;
    te[15] = 1;

    return new Transform(te);
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
  public static Scale(location: Vector3d, scalar: number) {
    // move location to origin
    const m1 = Transform.Translation(location.Reverse());

    // scale
    const m2 = Transform.ScaleAtOrigin(scalar, scalar, scalar);

    // move back
    const m3 = Transform.Translation(location);

    // return m3 * m2 * m1
    return m3.MultiplyMatrix(m2).MultiplyMatrix(m1);
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
   * Transpose the matrix and return a new one.
   */
  public Transpose() {
    const te = this.M;
    let tmp;

    tmp = te[1];
    te[1] = te[4];
    te[4] = tmp;
    tmp = te[2];
    te[2] = te[8];
    te[8] = tmp;
    tmp = te[6];
    te[6] = te[9];
    te[9] = tmp;

    tmp = te[3];
    te[3] = te[12];
    te[12] = tmp;
    tmp = te[7];
    te[7] = te[13];
    te[13] = tmp;
    tmp = te[11];
    te[11] = te[14];
    te[14] = tmp;

    return new Transform(te);
  }

  /**
   * Attempts to get the inverse transform of this transform.
   */
  public TryGetInverse(): Transform | null {
    const te = this.M;

    const [n11, n21, n31, n41, n12, n22, n32, n42, n13, n23, n33, n43, n14, n24, n34, n44] = this.m;

    const t11 = n23 * n34 * n42 - n24 * n33 * n42 + n24 * n32 * n43 - n22 * n34 * n43 - n23 * n32 * n44 + n22 * n33 * n44,
      t12 = n14 * n33 * n42 - n13 * n34 * n42 - n14 * n32 * n43 + n12 * n34 * n43 + n13 * n32 * n44 - n12 * n33 * n44,
      t13 = n13 * n24 * n42 - n14 * n23 * n42 + n14 * n22 * n43 - n12 * n24 * n43 - n13 * n22 * n44 + n12 * n23 * n44,
      t14 = n14 * n23 * n32 - n13 * n24 * n32 - n14 * n22 * n33 + n12 * n24 * n33 + n13 * n22 * n34 - n12 * n23 * n34;

    const det = n11 * t11 + n21 * t12 + n31 * t13 + n41 * t14;

    if (det === 0) return null;

    const detInv = 1 / det;

    te[0] = t11 * detInv;
    te[1] = (n24 * n33 * n41 - n23 * n34 * n41 - n24 * n31 * n43 + n21 * n34 * n43 + n23 * n31 * n44 - n21 * n33 * n44) * detInv;
    te[2] = (n22 * n34 * n41 - n24 * n32 * n41 + n24 * n31 * n42 - n21 * n34 * n42 - n22 * n31 * n44 + n21 * n32 * n44) * detInv;
    te[3] = (n23 * n32 * n41 - n22 * n33 * n41 - n23 * n31 * n42 + n21 * n33 * n42 + n22 * n31 * n43 - n21 * n32 * n43) * detInv;

    te[4] = t12 * detInv;
    te[5] = (n13 * n34 * n41 - n14 * n33 * n41 + n14 * n31 * n43 - n11 * n34 * n43 - n13 * n31 * n44 + n11 * n33 * n44) * detInv;
    te[6] = (n14 * n32 * n41 - n12 * n34 * n41 - n14 * n31 * n42 + n11 * n34 * n42 + n12 * n31 * n44 - n11 * n32 * n44) * detInv;
    te[7] = (n12 * n33 * n41 - n13 * n32 * n41 + n13 * n31 * n42 - n11 * n33 * n42 - n12 * n31 * n43 + n11 * n32 * n43) * detInv;

    te[8] = t13 * detInv;
    te[9] = (n14 * n23 * n41 - n13 * n24 * n41 - n14 * n21 * n43 + n11 * n24 * n43 + n13 * n21 * n44 - n11 * n23 * n44) * detInv;
    te[10] = (n12 * n24 * n41 - n14 * n22 * n41 + n14 * n21 * n42 - n11 * n24 * n42 - n12 * n21 * n44 + n11 * n22 * n44) * detInv;
    te[11] = (n13 * n22 * n41 - n12 * n23 * n41 - n13 * n21 * n42 + n11 * n23 * n42 + n12 * n21 * n43 - n11 * n22 * n43) * detInv;

    te[12] = t14 * detInv;
    te[13] = (n13 * n24 * n31 - n14 * n23 * n31 + n14 * n21 * n33 - n11 * n24 * n33 - n13 * n21 * n34 + n11 * n23 * n34) * detInv;
    te[14] = (n14 * n22 * n31 - n12 * n24 * n31 - n14 * n21 * n32 + n11 * n24 * n32 + n12 * n21 * n34 - n11 * n22 * n34) * detInv;
    te[15] = (n12 * n23 * n31 - n13 * n22 * n31 + n13 * n21 * n32 - n11 * n23 * n32 - n12 * n21 * n33 + n11 * n22 * n33) * detInv;

    return new Transform(te);
  }
}

# Open3d

![banner](https://github.com/ccc159/Open3d/raw/master/assets/open3d_banner.jpg)

Open3d is a 3d geometry library for JavaScript/Typescript inspired by [RhinoCommon](https://developer.rhino3d.com/api/RhinoCommon/html/R_Project_RhinoCommon.htm) API.

This library is created because so far there has not been a proper typed 3d geometry library for node environment. It is often necessary to calculate vector math or basic intersections of lines or planes but it is very cumbersome or error-prone to invent the wheel. And Open3d tries to save you from the distress. It is written in Typescript which supports native types for your project without the hassle of installing "@types/xxx". Also, it is a pure package that has zero dependencies.

It currently has `Point3d`, `Vector3d`, `Line`, `Transform (or Matrix4x4)`, `Plane` and `Intersection` definitions.

# Install

**via Yarn**

```bash
yarn add open3d
```

or **via NPM**

```bash
npm i open3d
```

or if you prefer to drive without safe belt **via CDN**:

```html
<script src="https://unpkg.com/open3d"></script>
```

# Usage

If you are familiar with RhinoCommon, then Open3d should be very intuitive to use. Even if not, the functionalities are self-explanatory.

### Example 1: Find the closest point on a line for a test point

```typescript
import { Line, Point3d } from 'open3d';
// if you use CDN, you can use the global parameter "Open3d" without import, such as "Open3d.Vector"

const p = new Point3d(1, 2, 3);

const from = new Point3d(6, 7, 8);
const to = new Point3d(-2, 0, 3);
const line = new Line(from, to);

const closestPt = line.ClosestPoint(p);
```

### Example 2: Intersection of two lines

```typescript
import { Line, Point3d, Intersection } from 'open3d';

const line1 = new Line(new Point3d(-4, -1, 0), new Point3d(5, 0, 0));

const line2 = new Line(new Point3d(0, -2, 0), new Point3d(3, 7, 0));

const intersection = Intersection.LineLine(line1, line2);
```

### Example 3: Transform a plane and find the normal of the transformed plane

```typescript
import { Line, Vector3d, Point3d, Transform, Plane } from 'open3d';

// translation
const translate = Transform.Translation(new Vector3d(1, 2, 3));

// rotation
const rotation = Transform.Rotation(Math.PI / 3, new Vector3d(5, 2, 0), new Point3d(-2, 2, 9));

// scale
const scale = Transform.Scale(new Point3d(1, 2, 3), 3);

// mirror
const mirror = Transform.Mirror(new Plane(Point3d.Origin, new Vector3d(8, 2, -4), new Vector3d(0, 8, 5)));

// combine transform
const transformation = Transform.CombineTransforms([translate, rotation, scale, mirror]);

// transform plane
const plane = new Plane(Point3d.Origin, Vector3d.XAxis, Vector3d.YAxis);
const transformedPlane = plane.Transform(transformation);
```

# API Reference

The full API reference can be found at [https://open3d.chen.works/](https://open3d.chen.works/).

# Contribute

Any form of contributions to fix/optimize or extend the library are welcome! Please take advantage of Github's [issues](https://github.com/ccc159/open3d/issues) or [pull requests](https://github.com/ccc159/open3d/pulls). :)

If you realy find it useful and like to contribute straightforwardly, feel free to [buy me a coffee](https://www.buymeacoffee.com/ccc159) :)

# License

[GPLv3](./LICENSE.md)

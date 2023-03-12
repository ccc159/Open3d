import { Line } from '../src/Line';
import { Transform } from '../src/Transform';
import { Point3d } from '../src/Point3d';
import { Vector3d } from '../src/Vector3d';
import { Polyline } from '../src/Polyline';
import { Open3d } from '../src/Open3d';

let p1: Point3d;
let p2: Point3d;
let p3: Point3d;
let p4: Point3d;
let p5: Point3d;
let p6: Point3d;
let p7: Point3d;
let pl: Polyline;

beforeEach(() => {
  p1 = new Point3d(-9.847383153, -1.039505604, -7.056109078);
  p2 = new Point3d(-5.119378833, -5.357697228, -8.103615608);
  p3 = new Point3d(4.348499638, -9.092637979, -4.45141898);
  p4 = new Point3d(4.992788358, -3.947536677, 2.116964028);
  p5 = new Point3d(-3.524238513, 6.176224321, 6.748736056);
  p6 = new Point3d(-8.928751456, 2.716919496, -1.88067132);
  p7 = p1;
  const pts = [p1, p2, p3, p4, p5, p6, p7];
  pl = new Polyline(pts);
});

test('Count', () => {
  expect(pl.Count).toBe(pl.Count);
});

test('CenterPoint', () => {
  expect(pl.TryGetPlane()).toBeDefined();
  expect(pl.TryGetPlane()?.IsPointCoplanar(pl.CenterPoint)).toBe(true);
  // below is the area center of the polygon from GH. It's different from the CenterPoint though.
  expect(pl.TryGetPlane()?.IsPointCoplanar(new Point3d(-2.34840581, -1.608275651, -1.366530565))).toBe(true);
});

test('IsValid', () => {
  expect(pl.IsValid).toBe(true);
  expect(new Polyline([]).IsValid).toBe(false);
  expect(new Polyline([p1]).IsValid).toBe(false);
  expect(new Polyline([p1, p1]).IsValid).toBe(false);
  expect(new Polyline([p1, p2]).IsValid).toBe(true);
  expect(new Polyline([p1, p2, p1]).IsValid).toBe(false);
  expect(new Polyline([p1, p2, p3]).IsValid).toBe(true);
  expect(new Polyline([p1, p2, p3, p3, p4, p5]).IsValid).toBe(false);
});

test('SegmentCount', () => {
  expect(pl.SegmentCount).toBe(6);
  expect(new Polyline([]).SegmentCount).toBe(0);
  expect(new Polyline([p1]).SegmentCount).toBe(0);
  expect(new Polyline([p1, p1]).SegmentCount).toBe(1);
  expect(new Polyline([p1, p2]).SegmentCount).toBe(1);
  expect(new Polyline([p1, p2, p1]).SegmentCount).toBe(2);
  expect(new Polyline([p1, p2, p3]).SegmentCount).toBe(2);
  expect(new Polyline([p1, p2, p3, p3, p4, p5]).SegmentCount).toBe(5);
});

test('IsClosed', () => {
  expect(pl.IsClosed).toBe(true);
  expect(new Polyline([]).IsClosed).toBe(false);
  expect(new Polyline([p1]).IsClosed).toBe(false);
  expect(new Polyline([p1, p1]).IsClosed).toBe(false);
  expect(new Polyline([p1, p2]).IsClosed).toBe(false);
  expect(new Polyline([p1, p2, p1]).IsClosed).toBe(true);
  expect(new Polyline([p1, p2, p3]).IsClosed).toBe(false);
  expect(new Polyline([p1, p2, p3, p3, p4, p5]).IsClosed).toBe(false);
  expect(new Polyline([p1, p2, p3, p3, p4, p1]).IsClosed).toBe(true);
});

test('Length', () => {
  expect(pl.Length).toBeCloseTo(56.901719112);
});

test('PointAt', () => {
  expect(pl.PointAt(0).Equals(p1)).toBe(true);
  expect(pl.PointAt(1).Equals(p2)).toBe(true);
  expect(pl.PointAt(1.5).Equals(new Point3d(-0.385439598, -7.225167604, -6.277517294))).toBe(true);
  expect(pl.PointAt(20).Equals(p7)).toBe(true);
  expect(pl.PointAt(-10).Equals(p1)).toBe(true);
  expect(pl.PointAt(3.2435).Equals(new Point3d(2.918892315, -1.482400874, 3.244800517))).toBe(true);
});

test('SegmentAt', () => {
  expect(pl.SegmentAt(-1)).toBe(null);
  expect(pl.SegmentAt(1)!.Equals(new Line(p2, p3))).toBe(true);
  expect(pl.SegmentAt(1.5)!.Equals(new Line(p2, p3))).toBe(true);
  expect(pl.SegmentAt(20)).toBe(null);
  expect(pl.SegmentAt(-10)).toBe(null);
  expect(pl.SegmentAt(3.2435)!.Equals(new Line(p4, p5))).toBe(true);
});

test('TangentAt', () => {
  expect(pl.TangentAt(0).Equals(new Vector3d(0.728696616055226, -0.665534845351029, -0.161445382012755))).toBe(true);
  expect(pl.TangentAt(1).Equals(new Vector3d(0.875571209571051, -0.345400144425917, 0.33774812686504))).toBe(true);
  expect(pl.TangentAt(1.5).Equals(new Vector3d(0.875571209571051, -0.345400144425917, 0.33774812686504))).toBe(true);
  expect(pl.TangentAt(20).Equals(new Vector3d(-0.142189131731189, -0.581433043272133, -0.801072947370486))).toBe(true);
  expect(pl.TangentAt(-10).Equals(new Vector3d(0.728696616055226, -0.665534845351029, -0.161445382012755))).toBe(true);
  expect(pl.TangentAt(3.2435).Equals(new Vector3d(-0.60760993860125, 0.722235340043596, 0.330433466987072))).toBe(true);
});

test('Trim', () => {
  let pl2 = pl.Trim(1.2, 3.4);
  expect(pl2.First.Equals(new Point3d(-3.225803139, -6.104685378, -7.373176282))).toBe(true);
  expect(pl2.Last.Equals(new Point3d(1.58597761, 0.101967722, 3.969672839))).toBe(true);
  expect(pl2.Count).toBe(4);
  pl2 = pl.Trim(-10, 10);
  expect(pl2.First.Equals(p1)).toBe(true);
  expect(pl2.Last.Equals(p7)).toBe(true);
});

test('ClosestPoint, ClosestParameter', () => {
  const pts = [
    new Point3d(-11.573819819, 10.982734899, -18.804158296),
    new Point3d(1.241431702, 0.511512095, 4.157045513),
    new Point3d(14.656900542, -2.036659608, 0),
    new Point3d(9.058564811, -14.30747063, 17.857531201),
  ];

  let clostPts = [
    new Point3d(-9.847383153, -1.039505604, -7.056109078),
    new Point3d(1.241431702, 0.511512095, 4.157045513),
    new Point3d(4.992788358, -3.947536677, 2.116964028),
    new Point3d(4.992788358, -3.947536677, 2.116964028),
  ];

  let clostParams = [0, 3.440453777, 3, 3];

  let clostDist = [16.897677672, 0, 10.076112949, 19.277557538];
  for (let i = 0; i < pts.length; i++) {
    const pt = pts[i];
    const cp = pl.ClosestPoint(pt);
    expect(cp.DistanceTo(pt)).toBeCloseTo(clostDist[i]);
    expect(cp.Equals(clostPts[i])).toBe(true);
    expect(pl.ClosestParameter(pt)).toBeCloseTo(clostParams[i]);
  }

  // move pl points to up
  let newPts = pl.Map((p, i) => p.Add(new Vector3d(0, 0, i * 1)));
  pl = new Polyline(newPts);

  clostPts = [
    new Point3d(-9.847383153, -1.039505604, -7.056109078),
    new Point3d(2.03962725, -0.437262764, 7.069702979),
    new Point3d(4.819260927, -5.333275993, 3.078557926),
    new Point3d(4.992788358, -3.947536677, 5.116964028),
  ];

  clostParams = [0, 3.34673615, 2.730668215, 3];

  clostDist = [16.897677672, 3.165574732, 10.822400458, 16.916879782];

  for (let i = 0; i < pts.length; i++) {
    const pt = pts[i];
    const cp = pl.ClosestPoint(pt);
    expect(cp.DistanceTo(pt)).toBeCloseTo(clostDist[i]);
    expect(cp.Equals(clostPts[i])).toBe(true);
    expect(pl.ClosestParameter(pt)).toBeCloseTo(clostParams[i]);
  }
});

test('GetSegments', () => {
  let segments = pl.GetSegments();
  expect(segments.length).toBe(6);
  expect(segments[0].Equals(new Line(p1, p2))).toBe(true);
  expect(segments[1].Equals(new Line(p2, p3))).toBe(true);
  expect(segments[2].Equals(new Line(p3, p4))).toBe(true);
  expect(segments[3].Equals(new Line(p4, p5))).toBe(true);
  expect(segments[4].Equals(new Line(p5, p6))).toBe(true);
  expect(segments[5].Equals(new Line(p6, p7))).toBe(true);
});

test('DeleteShortSegments', () => {
  let pl2 = new Polyline([p1, p2, p3, p4, p4, p5, p6, p6, p7, p7]);
  expect(pl2.Count).toBe(10);
  pl2 = pl.DeleteShortSegments();
  expect(pl2.Count).toBe(7);
  expect(pl2.IsClosed).toBe(true);
});

test('Smooth', () => {
  expect(pl.Smooth(1)?.Length).toBeCloseTo(40.998096758);
  expect(pl.Smooth(2)?.Length).toBeCloseTo(29.502297557);
});

test('IsPlanar', () => {
  expect(pl.IsPlanar()).toBe(true);
  pl.Set(0, new Point3d(0, 0, 1));
  expect(pl.IsPlanar()).toBe(false);
});

test('TryGetPlane', () => {
  const plane = pl.TryGetPlane();
  expect(plane).toBeDefined();
  expect(plane?.Normal.IsParallelTo(new Vector3d(-0.482252697, -0.666056741, 0.569034932))).toBe(Open3d.ParallelIndicator.Parallel);
});

test('IsPointOn', () => {
  let p = new Point3d(1.241431702, 0.511512095, 4.157045513);
  expect(pl.IsPointOn(p1)).toBe(true);
  expect(pl.IsPointOn(p)).toBe(true);
  expect(pl.IsPointOn(new Point3d(2, 5, 4))).toBe(false);
});

test('IsPointInside', () => {
  let ptOn = new Point3d(1.241431702, 0.511512095, 4.157045513);
  let ptNotPlanar = new Point3d(9.058564811, -14.30747063, 17.857531201);
  let ptOut = new Point3d(8.822134933, -8.693114931, -0.192405046);
  let ptInside = new Point3d(-0.282966186, -3.927203993, -2.330397622);
  expect(pl.IsPointInside(ptOn)).toBe(false);
  expect(pl.IsPointInside(ptNotPlanar)).toBe(false);
  expect(pl.IsPointInside(ptOut)).toBe(false);
  expect(pl.IsPointInside(ptInside)).toBe(true);

  let pl2 = new Polyline([p1, p2, p4, p5]);
  expect(() => pl2.IsPointInside(ptOn)).toThrowError();

  // move pl points to up
  let newPts = pl.Map((p, i) => p.Add(new Vector3d(0, 0, i * 1)));
  pl = new Polyline(newPts);

  expect(() => pl.IsPointInside(ptOn)).toThrowError();
});

test('TryGetArea', () => {
  expect(pl.TryGetArea()).toBeCloseTo(214.439811057);
});

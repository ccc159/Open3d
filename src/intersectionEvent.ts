import { Point3d } from './Point3d';

export class IntersectionEvent {
  ParameterA: number;
  ParameterB: number;
  PointA: Point3d;
  PointB: Point3d;
  
  constructor(tA: number, tB: number, pA: Point3d, pB: Point3d) {
    this.ParameterA = tA;
    this.ParameterB = tB;
    this.PointA = pA;
    this.PointB = pB;
  }
}
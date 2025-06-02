import { ValidationError } from '../../application/errors/validation-error';
import DistanceCalculator from '../service/distance-calculator';
import { Coord } from '../value-objects/cood';
import { UUID } from '../value-objects/UUID';
import { Position } from './position';

export enum RideStatusEnum {
  REQUESTED = 'REQUESTED',
  IN_PROGRESS = 'IN_PROGRESS',
  COMPLETED = 'COMPLETED',
  CANCELLED = 'CANCELLED',
  ACCEPTED = 'ACCEPTED',
}

export type RideInput = {
  id?: string;
  passengerId: string;
  fromLat: number;
  fromLong: number;
  toLat: number;
  toLong: number;
  status: RideStatusEnum;
  fare?: number;
  distance?: number;
  dateRide: Date;
};

export class Ride {
  private from: Coord;
  private to: Coord;
  private id: UUID;
  private passengerId: UUID;
  private driverId?: UUID;

  constructor(
    id: string,
    passengerId: string,
    fromLat: number,
    fromLong: number,
    toLat: number,
    toLong: number,
    private status: RideStatusEnum,
    readonly dateRide: Date,
    driverId: string | null,
    private fare: number,
    private distance: number
  ) {
    if (!passengerId) {
      throw new ValidationError('Invalid passenger ID');
    }
    if (driverId) this.driverId = new UUID(driverId);
    this.passengerId = new UUID(passengerId);
    this.id = new UUID(id);
    this.from = new Coord(fromLat, fromLong);
    this.to = new Coord(toLat, toLong);
  }

  accept(driverId: string) {
    this.driverId = new UUID(driverId);
    if (this.status !== RideStatusEnum.REQUESTED)
      throw new Error('Invalid status');
    this.status = RideStatusEnum.ACCEPTED;
  }

  start() {
    if (this.status !== RideStatusEnum.ACCEPTED) {
      throw new Error('Invalid status');
    }

    this.status = RideStatusEnum.IN_PROGRESS;
  }

  finish(positions: Position[]) {
    this.status = RideStatusEnum.COMPLETED;
    for (const [index, position] of positions.entries()) {
      const nextPosition = positions[index + 1];
      if (!nextPosition) break;
      const distance = DistanceCalculator.calculateDistanceBetweenPositions([
        position,
        nextPosition,
      ]);
      this.distance += distance;
    }
    this.fare = this.distance * 2.1;
  }

  static create(props: RideInput): Ride {
    const { passengerId, fromLat, toLat, fromLong, toLong, status, dateRide } =
      props;
    const fare = 0;
    const distance = 0;
    const id = props.id ?? crypto.randomUUID();
    return new Ride(
      id,
      passengerId,
      fromLat,
      fromLong,
      toLat,
      toLong,
      status,
      dateRide,
      null,
      fare,
      distance
    );
  }

  getDistance() {
    return this.distance;
  }

  getFare() {
    return this.fare;
  }

  getRideId() {
    return this.id.getValue();
  }

  getPassengerId() {
    return this.passengerId.getValue();
  }

  getDriverId() {
    return this.driverId?.getValue();
  }

  getFrom() {
    return this.from;
  }

  getTo() {
    return this.to;
  }

  getStatus() {
    return this.status;
  }
}

import { ValidationError } from '../../application/errors/validation-error';
import { Coord } from '../value-objects/cood';
import { UUID } from '../value-objects/UUID';

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
    driverId?: string | null,
    readonly fare?: number,
    readonly distance?: number
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
  private isValidLocation(location: { lat: number; long: number }) {
    return !isNaN(location.lat) || !isNaN(location.long);
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

  updatePosition(lat: number, long: number) {}

  static create(props: RideInput): Ride {
    const { passengerId, fromLat, toLat, fromLong, toLong, status, dateRide } =
      props;
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
      props.fare,
      props.distance
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

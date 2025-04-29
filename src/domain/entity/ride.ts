import { ValidationError } from '../../application/errors/validation-error';

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
  from: {
    lat: number;
    long: number;
  };
  to: {
    lat: number;
    long: number;
  };
  status: RideStatusEnum;
  fare?: number;
  distance?: number;
  dateRide: Date;
};

export class Ride {
  constructor(
    readonly id: string,
    readonly passengerId: string,
    readonly from: { lat: number; long: number },
    readonly to: { lat: number; long: number },
    private status: RideStatusEnum,
    readonly dateRide: Date,
    private driverId: string | null,
    readonly fare?: number,
    readonly distance?: number
  ) {
    if (!passengerId) {
      throw new ValidationError('Invalid passenger ID');
    }
    if (!this.isValidLocation(from)) {
      throw new ValidationError('Invalid location');
    }
    this.driverId = driverId ?? null;
  }
  private isValidLocation(location: { lat: number; long: number }) {
    return !isNaN(location.lat) || !isNaN(location.long);
  }

  accept(driverId: string) {
    this.driverId = driverId;
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
    const { passengerId, from, to, status, dateRide } = props;
    const id = props.id ?? crypto.randomUUID();
    return new Ride(
      id,
      passengerId,
      from,
      to,
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
    return this.id;
  }

  getPassengerId() {
    return this.passengerId;
  }

  getDriverId() {
    return this.driverId ?? null;
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

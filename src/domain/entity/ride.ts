import { ValidationError } from '../../application/errors/validation-error';

export enum RideStatusEnum {
  REQUESTED = 'REQUESTED',
  IN_PROGRESS = 'IN_PROGRESS',
  COMPLETED = 'COMPLETED',
  CANCELLED = 'CANCELLED',
}

type RideInput = {
  id?: string;
  driverId?: string;
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
    readonly status: RideStatusEnum,
    readonly dateRide: Date,
    readonly driverId?: string,
    readonly fare?: number,
    readonly distance?: number
  ) {
    if (!passengerId) {
      throw new ValidationError('Invalid passenger ID');
    }
    if (!this.isValidLocation(from)) {
      throw new ValidationError('Invalid location');
    }
  }
  private isValidLocation(location: { lat: number; long: number }) {
    return !isNaN(location.lat) || !isNaN(location.long);
  }

  static create(props: RideInput): Ride {
    const { driverId, passengerId, from, to, status, dateRide } = props;
    const id = props.id ?? crypto.randomUUID();
    return new Ride(
      id,
      passengerId,
      from,
      to,
      status,
      dateRide,
      driverId,
      props.fare,
      props.distance
    );
  }
}

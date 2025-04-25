export enum RideStatusEnum {
  REQUESTED = 'REQUESTED',
  IN_PROGRESS = 'IN_PROGRESS',
  COMPLETED = 'COMPLETED',
  CANCELLED = 'CANCELLED',
}

type RideInput = {
  id: string;
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
  public readonly id: string;
  public readonly driverId?: string;
  public readonly passengerId: string;
  public readonly from: { lat: number; long: number };
  public readonly to: { lat: number; long: number };
  public readonly status: RideStatusEnum;
  public readonly fare?: number;
  public readonly distance?: number;
  public readonly dateRide: Date;

  constructor(input: RideInput) {
    this.id = input.id;
    this.driverId = input.driverId;
    this.passengerId = input.passengerId;
    this.from = input.from;
    this.to = input.to;
    this.status = input.status;
    this.fare = input.fare;
    this.distance = input.distance;
    this.dateRide = input.dateRide;
  }
}

import { Coord } from '../value-objects/cood';
import { UUID } from '../value-objects/UUID';

export class Position {
  private positionId: UUID;
  private rideId: UUID;
  private coord: Coord;

  constructor(
    positionId: string,
    rideId: string,
    lat: number,
    long: number,
    readonly date: Date
  ) {
    this.positionId = new UUID(positionId);
    this.rideId = new UUID(rideId);
    this.coord = new Coord(lat, long);
  }

  static create(rideId: string, lat: number, long: number) {
    const positionId = UUID.create();
    const date = new Date();
    return new Position(positionId.getValue(), rideId, lat, long, date);
  }

  getRideId() {
    return this.rideId.getValue();
  }
  getPositionId() {
    return this.positionId.getValue();
  }
  getCoord() {
    return this.coord;
  }
}

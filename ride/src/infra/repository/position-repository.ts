import { Position } from '../../domain/entity/position';

export interface PositionRepository {
  savePosition(posiiton: Position): Promise<void>;
  listByRideId(rideId: string): Promise<Position[]>;
}

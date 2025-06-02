import DatabaseConnection from '../database/pg-promise';

import { User, UserTypeEnum } from '../../domain/entity/user';
import { UserRepository } from './user-repository';
import { PositionRepository } from './position-repository';
import { Position } from '../../domain/entity/position';

export class PgPromisePositionRepository implements PositionRepository {
  constructor(readonly db: DatabaseConnection) {}

  async savePosition(position: Position): Promise<void> {
    await this.db.query(
      'insert into ccca.position (position_id, ride_id, lat, long, date) values ($1, $2, $3, $4, $5)',
      [
        position.getPositionId(),
        position.getRideId(),
        position.getCoord().getLat(),
        position.getCoord().getLong(),
        position.date,
      ]
    );
  }

  async listByRideId(rideId: string): Promise<Position[]> {
    const positions = [];
    const positionsData = await this.db.query(
      'select * from ccca.position where ride_id = $1',
      [rideId]
    );
    for (const positionData of positionsData) {
      positions.push(
        new Position(
          positionData.position_id,
          positionData.ride_id,
          parseFloat(positionData.lat),
          parseFloat(positionData.long),
          positionData.date
        )
      );
    }
    return positions;
  }
}

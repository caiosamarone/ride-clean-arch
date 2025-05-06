import DatabaseConnection from '../database/pg-promise';

import { Ride, RideStatusEnum } from '../../domain/entity/ride';

import { RideRepository } from './ride-repository';

export class PgPromiseRideRepository implements RideRepository {
  constructor(readonly db: DatabaseConnection) {}

  async hasActiveRideByPassengerId(passengerId: string): Promise<boolean> {
    const rides = await this.db.query(
      'select * from ccca.ride where passenger_id = $1',
      [passengerId]
    );
    if (rides?.some((r: any) => r.status_ride !== RideStatusEnum.COMPLETED)) {
      return true;
    }
    return false;
  }

  async hasActiveRideByDriverId(driverId: string): Promise<boolean> {
    const [rideData] = await this.db.query(
      "select 1 from ccca.ride where driver_id = $1 and status not in ('completed', 'cancelled') limit 1",
      [driverId]
    );
    return !!rideData;
  }

  async create(input: Ride): Promise<void> {
    try {
      const status = RideStatusEnum.REQUESTED;
      await this.db.query(
        'insert into ccca.ride  (ride_id, passenger_id, from_long, from_lat, to_long, to_lat, status_ride, date_ride, fate, distance) values ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10)',
        [
          input.getRideId(),
          input.getPassengerId(),
          input.getFrom().getLong(),
          input.getFrom().getLat(),
          input.getTo().getLong(),
          input.getTo().getLat(),
          status,
          input.dateRide,
          input.getFare(),
          input.getDistance(),
        ]
      );
    } catch (error) {
      throw new Error('Failed to create ride');
    }
  }

  async get(rideId: string): Promise<Ride | null> {
    const [ride] = await this.db.query(
      'select * from ccca.ride where ride_id = $1',
      [rideId]
    );
    if (!ride) {
      return null;
    }
    return new Ride(
      ride.ride_id,
      ride.passenger_id,
      ride.from_lat,
      ride.from_long,
      ride.to_lat,
      ride.to_long,
      ride.status_ride,
      ride.date_ride,
      ride.driver_id,
      ride.fare,
      ride.distance
    );
  }

  async update(ride: Ride): Promise<void> {
    await this.db.query(
      'update ccca.ride set status = $1, driver_id = $2, distance = $3, fare = $4 where ride_id = $5',
      [
        ride.getStatus(),
        ride.getRideId(),
        ride.distance,
        ride.fare,
        ride.getRideId(),
      ]
    );
  }
}

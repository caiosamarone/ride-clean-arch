import { db } from '../database/pg-promise';

import { Ride, RideStatusEnum } from '../../domain/entity/ride';
import { NotFoundError } from '../../application/errors/not-found';
import { CreateRideInput, RideRepository } from './ride-repository';

export class PgPromiseRideRepository implements RideRepository {
  private db: any;
  constructor() {
    this.db = db;
  }

  async hasActiveRide(passengerId: string): Promise<boolean> {
    const rides = await this.db.query(
      'select * from ccca.ride where passenger_id = $1',
      [passengerId]
    );
    if (rides?.some((r: any) => r.status_ride !== RideStatusEnum.COMPLETED)) {
      return true;
    }
    return false;
  }

  async create(input: CreateRideInput): Promise<void> {
    try {
      const { passengerId, dateRide, from, id, status, to, fare, distance } =
        input.ride;
      await this.db.query(
        'insert into ccca.ride  (ride_id, passenger_id, from_long, from_lat, to_long, to_lat, status_ride, date_ride) values ($1, $2, $3, $4, $5, $6, $7, $8)',
        [
          id,
          passengerId,
          from.long,
          from.lat,
          to.long,
          to.lat,
          status,
          dateRide,
          fare,
          distance,
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
    return Ride.create({
      dateRide: ride.date_ride,
      driverId: ride.driver_id,
      fare: ride.fare,
      from: {
        lat: ride.from_lat,
        long: ride.from_long,
      },
      id: ride.ride_id,
      passengerId: ride.passenger_id,
      status: ride.status_ride,
      to: {
        lat: ride.to_lat,
        long: ride.to_long,
      },
      distance: ride.distance,
    });
  }
}

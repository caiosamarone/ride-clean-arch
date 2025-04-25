import { Ride } from '../../domain/entity/ride';

export type CreateRideInput = {
  ride: Ride;
};

export interface RideRepository {
  create(input: CreateRideInput): Promise<void>;
  get(rideId: string): Promise<Ride | null>;
  hasActiveRide(passengerId: string): Promise<boolean>;
}

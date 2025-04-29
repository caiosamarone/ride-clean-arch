import { Ride } from '../../domain/entity/ride';

export interface RideRepository {
  create(input: Ride): Promise<void>;
  get(rideId: string): Promise<Ride | null>;
  update(ride: Ride): Promise<void>;
  hasActiveRideByPassengerId(passengerId: string): Promise<boolean>;
  hasActiveRideByDriverId(driverId: string): Promise<boolean>;
}

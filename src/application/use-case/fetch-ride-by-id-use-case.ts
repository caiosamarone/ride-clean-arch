import { RideStatusEnum } from '../../domain/entity/ride';
import { RideRepository } from '../../infra/repository/ride-repository';
import { UserRepository } from '../../infra/repository/user-repository';
import { NotFoundError } from '../errors/not-found';

export type FetchRideByIdInput = {
  rideId: string;
};

type FetchRideByIdOutput = {
  rideId: string;
  passengerId: string;
  passengerName: string;
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

export class FecthRideByIdUseCase {
  constructor(
    private readonly rideRepository: RideRepository,
    private readonly userRepository: UserRepository
  ) {}

  async execute(input: FetchRideByIdInput): Promise<FetchRideByIdOutput> {
    const ride = await this.rideRepository.get(input.rideId);
    if (!ride) {
      throw new NotFoundError('Ride not found');
    }
    const passenger = await this.userRepository.getUserById(ride.passengerId);
    if (!passenger) {
      throw new NotFoundError('User not found');
    }
    return {
      dateRide: ride.dateRide,
      from: {
        lat: ride.from.lat,
        long: ride.from.long,
      },
      fare: ride.fare,
      passengerId: ride.passengerId,
      passengerName: passenger.name,
      status: ride.status,
      to: {
        lat: ride.to.lat,
        long: ride.to.long,
      },
      distance: ride.distance,
      rideId: ride.id,
    };
  }
}

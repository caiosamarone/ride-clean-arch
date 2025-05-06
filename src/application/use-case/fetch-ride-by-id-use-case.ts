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
  fromLat: number;
  fromLong: number;
  toLat: number;
  toLong: number;
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
    const passenger = await this.userRepository.getUserById(
      ride.getPassengerId()
    );
    if (!passenger) {
      throw new NotFoundError('User not found');
    }
    return {
      dateRide: ride.dateRide,
      fromLat: ride.getFrom().getLat(),
      fromLong: ride.getFrom().getLong(),
      toLat: ride.getTo().getLat(),
      toLong: ride.getTo().getLong(),
      fare: ride.fare,
      passengerId: ride.getPassengerId(),
      passengerName: passenger.getName(),
      status: ride.getStatus(),
      distance: ride.distance,
      rideId: ride.getRideId(),
    };
  }
}

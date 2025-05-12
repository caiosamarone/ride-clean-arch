import { RideStatusEnum } from '../../domain/entity/ride';
import DistanceCalculator from '../../domain/service/distance-calculator';
import { PositionRepository } from '../../infra/repository/position-repository';
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
    private readonly userRepository: UserRepository,
    private readonly positionRepository: PositionRepository
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
    const positions = await this.positionRepository.listByRideId(
      ride.getRideId()
    );
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
      distance: DistanceCalculator.calculateDistanceBetweenPositions(positions),
      rideId: ride.getRideId(),
    };
  }
}

import { RideStatusEnum } from '../../domain/entity/ride';
import DistanceCalculator from '../../domain/service/distance-calculator';
import { PositionRepository } from '../../infra/repository/position-repository';
import { RideRepository } from '../../infra/repository/ride-repository';

type Input = {
  rideId: string;
  creditCardToken: string;
  amount: string;
};

export class FinishRideUseCase {
  constructor(
    private readonly rideRepository: RideRepository,
    private readonly positionRepository: PositionRepository
  ) {}

  async execute(input: Input): Promise<void> {
    const ride = await this.rideRepository.get(input.rideId);
    if (!ride || ride.getStatus() !== RideStatusEnum.IN_PROGRESS)
      throw new Error('Invalid status to completing a ride');

    const positions = await this.positionRepository.listByRideId(
      ride.getRideId()
    );
    ride.finish(positions);
    await this.rideRepository.update(ride);
  }
}

import { Position } from '../../domain/entity/position';
import { RideStatusEnum } from '../../domain/entity/ride';
import { PositionRepository } from '../../infra/repository/position-repository';
import { RideRepository } from '../../infra/repository/ride-repository';

type UpdateRidePositionUseCaseInput = {
  rideId: string;
  lat: number;
  long: number;
};
export class UpdateRidePositionUseCase {
  constructor(
    private readonly rideRepository: RideRepository,
    private readonly positionRepository: PositionRepository
  ) {}

  async execute(input: UpdateRidePositionUseCaseInput): Promise<void> {
    const ride = await this.rideRepository.get(input.rideId);
    if (!ride) {
      throw new Error('Ride not found');
    }
    if (ride.getStatus() !== RideStatusEnum.IN_PROGRESS) {
      throw new Error('Ride is not in progress');
    }
    const position = Position.create(input.rideId, input.lat, input.long);
    await this.positionRepository.savePosition(position);
  }
}

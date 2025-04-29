import { RideStatusEnum } from '../../domain/entity/ride';
import { RideRepository } from '../../infra/repository/ride-repository';
type UpdateRidePositionUseCaseInput = {
  rideId: string;
  lat: number;
  long: number;
};
export class UpdateRidePositionUseCase {
  constructor(private readonly rideRepository: RideRepository) {}

  async execute(input: UpdateRidePositionUseCaseInput): Promise<void> {
    const ride = await this.rideRepository.get(input.rideId);
    if (!ride) {
      throw new Error('Ride not found');
    }
    if (ride.getStatus() !== RideStatusEnum.ACCEPTED) {
      throw new Error('Ride is not accepted');
    }
    await this.rideRepository.update(ride);
  }
}

import { RideStatusEnum } from '../../domain/entity/ride';
import { RideRepository } from '../../infra/repository/ride-repository';

type StartRideUseCaseInput = {
  rideId: string;
};

export class StartRideUseCase {
  constructor(private readonly rideRepository: RideRepository) {}

  async execute(input: StartRideUseCaseInput): Promise<void> {
    const ride = await this.rideRepository.get(input.rideId);
    if (!ride) {
      throw new Error('Ride not found');
    }
    if (ride.getStatus() !== RideStatusEnum.ACCEPTED) {
      throw new Error('Ride is not accepted');
    }
    ride.start();
    await this.rideRepository.update(ride);
  }
}

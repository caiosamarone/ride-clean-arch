import { RideStatusEnum } from '../../domain/entity/ride';
import { UserGateway } from '../../infra/gateway/user-gateway';

import { RideRepository } from '../../infra/repository/ride-repository';

type AcceptRideUseCaseInput = {
  rideId: string;
  driverId: string;
};

export class AcceptRideUseCase {
  constructor(
    private readonly userGateway: UserGateway,
    private readonly rideRepository: RideRepository
  ) {}

  async execute(input: AcceptRideUseCaseInput): Promise<void> {
    const userIsDriver = await this.validateUserIsADriver(input.driverId);
    if (!userIsDriver) {
      throw new Error('User is not a driver');
    }
    const isRideInRequestedStatus = await this.validateRideStatus(input.rideId);
    if (!isRideInRequestedStatus) {
      throw new Error('Ride is not in requested status');
    }
    const hasActiveRide = await this.rideRepository.hasActiveRideByDriverId(
      input.driverId
    );
    if (hasActiveRide) {
      throw new Error('Driver already has an active ride');
    }
    const ride = await this.rideRepository.get(input.rideId);
    if (!ride) {
      throw new Error('Ride not found');
    }

    await this.rideRepository.update(ride);
  }

  private async validateUserIsADriver(driverId: string): Promise<boolean> {
    const user = await this.userGateway.getUserById(driverId);
    if (!user || !user.isDriver) {
      return false;
    }
    return true;
  }

  private async validateRideStatus(rideId: string): Promise<boolean> {
    const ride = await this.rideRepository.get(rideId);
    if (!ride || ride.getStatus() !== RideStatusEnum.IN_PROGRESS) {
      return false;
    }
    return true;
  }
}

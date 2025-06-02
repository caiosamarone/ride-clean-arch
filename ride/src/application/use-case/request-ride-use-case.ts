import { Ride, RideStatusEnum } from '../../domain/entity/ride';

import { UserGateway } from '../../infra/gateway/user-gateway';
import { RideRepository } from '../../infra/repository/ride-repository';

import { NotFoundError } from '../errors/not-found';
import { UserNotPassengerError } from '../errors/user-not-passenger';
import { UserWithActiveRide } from '../errors/user-with-active-ride';

export type RequestRideInput = {
  passengerId: string;
  fromLat: number;
  fromLong: number;
  toLat: number;
  toLong: number;
};

export type RequestRideOutput = {
  rideId: string;
};

export class RequestRideUseCase {
  constructor(
    private readonly rideRepository: RideRepository,
    private readonly userGateway: UserGateway
  ) {}

  async execute(input: RequestRideInput): Promise<RequestRideOutput> {
    const { passengerId, fromLat, fromLong, toLat, toLong } = input;
    await this.checkUserIsPassenger(passengerId);
    await this.checkUserHasNoActiveRide(passengerId);
    const rideId = this.generateRideId();
    const ride = Ride.create({
      id: rideId,
      passengerId,
      fromLat,
      fromLong,
      toLat,
      toLong,
      status: RideStatusEnum.IN_PROGRESS,
      dateRide: new Date(),
    });
    await this.rideRepository.create(ride);
    return {
      rideId,
    };
  }

  private generateRideId(): string {
    return crypto.randomUUID();
  }

  private async checkUserIsPassenger(passengerId: string): Promise<void> {
    const user = await this.userGateway.getUserById(passengerId);
    if (!user) {
      throw new NotFoundError('User not found');
    }
    if (user.isDriver) {
      throw new UserNotPassengerError();
    }
  }

  private async checkUserHasNoActiveRide(passengerId: string): Promise<void> {
    const hasActiveRideByPassengerId =
      await this.rideRepository.hasActiveRideByPassengerId(passengerId);
    if (hasActiveRideByPassengerId) {
      throw new UserWithActiveRide();
    }
  }
}

import { UserTypeEnum } from '../entity/user';
import { Ride, RideStatusEnum } from '../entity/ride';

import { NotFoundError } from '../errors/not-found';
import { UserNotPassengerError } from '../errors/user-not-passenger';
import { UserWithActiveRide } from '../errors/user-with-active-ride';
import { RideRepository } from '../repository/ride-repository';
import { UserRepository } from '../repository/user-repository';

export type RequestRideInput = {
  passengerId: string;
  from: {
    lat: number;
    long: number;
  };
  to: {
    lat: number;
    long: number;
  };
};

export type RequestRideOutput = {
  rideId: string;
};

export class RequestRideUseCase {
  constructor(
    private readonly rideRepository: RideRepository,
    private readonly userRepository: UserRepository
  ) {}

  async execute(input: RequestRideInput): Promise<RequestRideOutput> {
    const { passengerId, from, to } = input;
    await this.checkUserIsPassenger(passengerId);
    await this.checkUserHasNoActiveRide(passengerId);
    const rideId = this.generateRideId();
    const ride = new Ride({
      id: rideId,
      passengerId,
      from,
      to,
      status: RideStatusEnum.REQUESTED,
      dateRide: new Date(),
    });
    await this.rideRepository.create({
      ride,
    });
    return {
      rideId,
    };
  }

  private generateRideId(): string {
    return crypto.randomUUID();
  }

  private async checkUserIsPassenger(passengerId: string): Promise<void> {
    const user = await this.userRepository.getUserById(passengerId);
    if (!user) {
      throw new NotFoundError('User not found');
    }
    if (user.type === UserTypeEnum.DRIVER) {
      throw new UserNotPassengerError();
    }
  }

  private async checkUserHasNoActiveRide(passengerId: string): Promise<void> {
    const hasActiveRide = await this.rideRepository.hasActiveRide(passengerId);
    if (hasActiveRide) {
      throw new UserWithActiveRide();
    }
  }
}

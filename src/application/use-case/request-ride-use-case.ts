import { Ride, RideStatusEnum } from '../../domain/entity/ride';
import { UserTypeEnum } from '../../domain/entity/user';
import { RideRepository } from '../../infra/repository/ride-repository';
import { UserRepository } from '../../infra/repository/user-repository';
import { NotFoundError } from '../errors/not-found';
import { UserNotPassengerError } from '../errors/user-not-passenger';
import { UserWithActiveRide } from '../errors/user-with-active-ride';

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
    const ride = Ride.create({
      id: rideId,
      passengerId,
      from,
      to,
      status: RideStatusEnum.IN_PROGRESS,
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

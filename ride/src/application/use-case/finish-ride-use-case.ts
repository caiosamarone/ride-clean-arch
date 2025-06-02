import { RideStatusEnum } from '../../domain/entity/ride';

import { PositionRepository } from '../../infra/repository/position-repository';
import { RideRepository } from '../../infra/repository/ride-repository';
import { ProcessRidePaymentUseCase } from './process-ride-payment-use-case';

type Input = {
  rideId: string;
};

export class FinishRideUseCase {
  constructor(
    private readonly rideRepository: RideRepository,
    private readonly positionRepository: PositionRepository
    // private readonly processRidePaymentUseCase: ProcessRidePaymentUseCase
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
    //   const succesInPayment = await this.processRidePaymentUseCase.execute({
    //     amount: ride.getFare(),
    //     rideId: ride.getRideId(),
    //     creditCardToken: '',
    //   });
    //   if (!succesInPayment) {
    //     throw new Error('Error processing payment');
    //   }
  }
}

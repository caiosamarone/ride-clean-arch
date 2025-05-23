import { FinishRideUseCase } from '../../src/application/use-case/finish-ride-use-case';
import { Position } from '../../src/domain/entity/position';
import { PositionRepository } from '../../src/infra/repository/position-repository';
import { RideRepository } from '../../src/infra/repository/ride-repository';
import { makeRide } from './accept-ride-use-case.test';

let finishRideUseCase: FinishRideUseCase;
let positionRepository: PositionRepository;
let rideRepository: RideRepository;

function makePosition(
  positionId?: string,
  rideId?: string,
  lat?: number,
  long?: number,
  date?: Date
) {
  return new Position(
    positionId ?? 'position-id',
    rideId ?? 'ride-id',
    lat ?? 0,
    long ?? 0,
    date ?? new Date()
  );
}

describe('FinishRideUseCase', () => {
  beforeEach(() => {
    rideRepository = {
      get: jest.fn(),
      update: jest.fn(),
    } as any;
    positionRepository = {
      savePosition: jest.fn(),
      listByRideId: jest.fn(),
    };
    finishRideUseCase = new FinishRideUseCase(
      rideRepository,
      positionRepository
    );
  });

  it('should finish a ride', async () => {
    const ride = makeRide({ id: 'ride-id' });
    const positions = [
      makePosition('position-id-1', ride.getRideId(), -25.4289, -49.2733),
      makePosition('position-id-2', ride.getRideId(), -25.3389, -49.2733),
    ];

    jest.spyOn(rideRepository, 'get').mockResolvedValue(ride);
    jest.spyOn(positionRepository, 'listByRideId').mockResolvedValue(positions);

    await finishRideUseCase.execute({
      rideId: ride.getRideId(),
      amount: '100',
      creditCardToken: '123',
    });

    expect(rideRepository.get).toHaveBeenCalledWith(ride.getRideId());
    expect(positionRepository.listByRideId).toHaveBeenCalledWith(
      ride.getRideId()
    );
    expect(rideRepository.update).toHaveBeenCalledWith(
      expect.objectContaining({
        id: expect.objectContaining({ value: 'ride-id' }),
        status: 'COMPLETED',
        fare: 21,
        distance: 10,
      })
    );
  });
});

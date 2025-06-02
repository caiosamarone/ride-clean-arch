import { UpdateRidePositionUseCase } from '../../src/application/use-case/update-ride-position-use-case';

import { PositionRepository } from '../../src/infra/repository/position-repository';
import { RideRepository } from '../../src/infra/repository/ride-repository';

describe('UpdatePositionUseCase', () => {
  let rideRepository: jest.Mocked<RideRepository>;
  let positionRepository: jest.Mocked<PositionRepository>;
  let updateRidePositionUseCase: UpdateRidePositionUseCase;

  beforeEach(() => {
    rideRepository = {
      create: jest.fn(),
      hasActiveRideByPassengerId: jest.fn(),
      get: jest.fn(),
      update: jest.fn(),
    } as any;
    positionRepository = {
      listByRideId: jest.fn(),
      savePosition: jest.fn(),
    };
    updateRidePositionUseCase = new UpdateRidePositionUseCase(
      rideRepository,
      positionRepository
    );
  });

  it('should update a ride position', async () => {
    const rideMock = {
      start: jest.fn(),
      getStatus: jest.fn().mockReturnValue('IN_PROGRESS'),
    };
    jest.spyOn(rideRepository, 'get').mockResolvedValue(rideMock as any);
    const positionsRepositorySpy = jest.spyOn(
      positionRepository,
      'savePosition'
    );

    await updateRidePositionUseCase.execute({
      lat: -23.55052,
      long: -46.633309,
      rideId: 'fake-ride-id',
    });

    expect(positionsRepositorySpy).toHaveBeenCalledWith(
      expect.objectContaining({
        rideId: expect.objectContaining({ value: 'fake-ride-id' }),
        coord: {
          lat: -23.55052,
          long: -46.633309,
        },
        date: expect.anything(),
      })
    );
  });
});

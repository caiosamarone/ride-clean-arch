import { StartRideUseCase } from '../../src/application/use-case/start-ride-use-case';
import { RideRepository } from '../../src/infra/repository/ride-repository';

describe('StartRideUseCase', () => {
  let rideRepository: jest.Mocked<RideRepository>;
  let startRideUseCase: StartRideUseCase;

  beforeEach(() => {
    rideRepository = {
      create: jest.fn(),
      hasActiveRideByPassengerId: jest.fn(),
      get: jest.fn(),
      update: jest.fn(),
    } as any;
    startRideUseCase = new StartRideUseCase(rideRepository);
  });

  it('Deve iniciar uma corrida com sucesso', async () => {
    const rideMock = {
      start: jest.fn(),
      getStatus: jest.fn().mockReturnValue('ACCEPTED'),
    };
    jest.spyOn(rideRepository, 'get').mockResolvedValue(rideMock as any);
    const input = { rideId: 'ride-uuid' };
    await startRideUseCase.execute(input);
    expect(rideRepository.get).toHaveBeenCalledWith('ride-uuid');
    expect(rideMock.start).toHaveBeenCalled();
    expect(rideRepository.update).toHaveBeenCalled();
  });
});

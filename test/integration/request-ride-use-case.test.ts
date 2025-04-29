import { RequestRideUseCase } from '../../src/application/use-case/request-ride-use-case';
import { RideRepository } from '../../src/infra/repository/ride-repository';
import { UserRepository } from '../../src/infra/repository/user-repository';

describe('RequestRideUseCase', () => {
  let rideRepository: jest.Mocked<RideRepository>;
  let requestRideUseCase: RequestRideUseCase;
  let userRepository: jest.Mocked<UserRepository>;

  beforeEach(() => {
    rideRepository = {
      create: jest.fn(),
      hasActiveRideByPassengerId: jest.fn(),
    } as any;
    userRepository = {
      getUserById: jest.fn(),
      getUserByEmail: jest.fn(),
      create: jest.fn(),
    } as any;
    requestRideUseCase = new RequestRideUseCase(rideRepository, userRepository);
  });

  it('Deve criar uma ride com sucesso', async () => {
    rideRepository.hasActiveRideByPassengerId.mockResolvedValue(false);
    rideRepository.create.mockResolvedValue(undefined);
    userRepository.getUserById.mockResolvedValue({
      id: 'passenger-uuid',
      type: 'PASSENGER',
    } as any);
    const input = {
      passengerId: 'passenger-uuid',
      from: { lat: -23.5505, long: -46.6333 },
      to: { lat: -23.5505, long: -46.6332 },
    };
    const output = await requestRideUseCase.execute(input);
    expect(output.rideId).toEqual(expect.any(String));
    expect(rideRepository.create).toHaveBeenCalled();
  });

  it('Não deve criar uma ride se já houver uma ride ativa para o passageiro', async () => {
    rideRepository.hasActiveRideByPassengerId.mockResolvedValue(true);
    const input = {
      passengerId: 'passenger-uuid',
      from: { lat: -23.5505, long: -46.6333 },
      to: { lat: -23.5505, long: -46.6332 },
    };
    await expect(requestRideUseCase.execute(input)).rejects.toThrow();
    expect(rideRepository.create).not.toHaveBeenCalled();
  });
});

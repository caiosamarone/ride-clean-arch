import { UserWithActiveRide } from '../../src/application/errors/user-with-active-ride';
import { RequestRideUseCase } from '../../src/application/use-case/request-ride-use-case';
import { UserGateway } from '../../src/infra/gateway/user-gateway';

import { RideRepository } from '../../src/infra/repository/ride-repository';

describe('RequestRideUseCase', () => {
  let rideRepository: jest.Mocked<RideRepository>;
  let requestRideUseCase: RequestRideUseCase;
  let userGateway: jest.Mocked<UserGateway>;

  beforeEach(() => {
    rideRepository = {
      create: jest.fn(),
      hasActiveRideByPassengerId: jest.fn(),
    } as any;
    userGateway = {
      getUserById: jest.fn().mockResolvedValue({
        id: 'passenger-uuid',
        name: 'John Doe',
        email: 'johndoe@gmail.com',
        cpf: '123456789',
        isPassenger: true,
      }),
      signup: jest.fn(),
    };

    requestRideUseCase = new RequestRideUseCase(rideRepository, userGateway);
  });

  it('Deve criar uma ride com sucesso', async () => {
    rideRepository.hasActiveRideByPassengerId.mockResolvedValue(false);
    rideRepository.create.mockResolvedValue(undefined);

    const input = {
      passengerId: 'passenger-uuid',
      fromLat: -23.5505,
      fromLong: -46.6333,
      toLat: -23.5505,
      toLong: -46.6332,
    };
    const output = await requestRideUseCase.execute(input);
    expect(output.rideId).toEqual(expect.any(String));
    expect(rideRepository.create).toHaveBeenCalled();
  });

  it('Não deve criar uma ride se já houver uma ride ativa para o passageiro', async () => {
    rideRepository.hasActiveRideByPassengerId.mockResolvedValue(true);
    const input = {
      passengerId: 'passenger-uuid',
      fromLat: -23.5505,
      fromLong: -46.6333,
      toLat: -23.5505,
      toLong: -46.6332,
    };
    await expect(requestRideUseCase.execute(input)).rejects.toThrow(
      new UserWithActiveRide()
    );
    expect(rideRepository.create).not.toHaveBeenCalled();
  });
});

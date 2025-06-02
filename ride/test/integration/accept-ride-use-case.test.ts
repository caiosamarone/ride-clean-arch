import { faker } from '@faker-js/faker/.';
import { AcceptRideUseCase } from '../../src/application/use-case/accept-ride-use-case';

import { RideRepository } from '../../src/infra/repository/ride-repository';

import { Ride, RideInput, RideStatusEnum } from '../../src/domain/entity/ride';
import { UserGateway } from '../../src/infra/gateway/user-gateway';

export function makeRide(props: Partial<RideInput>): Ride {
  return Ride.create({
    id: faker.string.uuid(),
    passengerId: faker.string.uuid(),
    fromLat: -23.5505,
    fromLong: -46.6333,
    toLat: -23.5505,
    toLong: -46.6332,
    status: RideStatusEnum.IN_PROGRESS,
    fare: faker.number.float({ min: 10, max: 100 }),
    distance: faker.number.float({ min: 1, max: 50 }),
    dateRide: faker.date.recent(),
    ...props,
  });
}

describe('AcceptRideUseCase', () => {
  let rideRepository: jest.Mocked<RideRepository>;
  let userGateway: jest.Mocked<UserGateway>;
  let acceptRideUseCase: AcceptRideUseCase;

  beforeEach(() => {
    rideRepository = {
      create: jest.fn(),
      hasActiveRideByPassengerId: jest.fn(),
      get: jest.fn(),
      update: jest.fn(),
      hasActiveRideByDriverId: jest.fn(),
    } as any;
    userGateway = {
      getUserById: jest.fn().mockResolvedValue({
        id: 'passenger-uuid',
        name: 'John Doe',
        email: 'johndoe@gmail.com',
        cpf: '123456789',
        isPassenger: false,
        isDriver: true,
      }),
      signup: jest.fn(),
    };
    acceptRideUseCase = new AcceptRideUseCase(userGateway, rideRepository);
  });

  it('Deve aceitar uma corrida com sucesso', async () => {
    const ride = makeRide({});
    jest.spyOn(rideRepository, 'get').mockResolvedValue(ride);
    jest
      .spyOn(rideRepository, 'hasActiveRideByDriverId')
      .mockResolvedValue(false);
    await acceptRideUseCase.execute({
      driverId: 'fake',
      rideId: ride.getRideId(),
    });
    expect(rideRepository.update).toHaveBeenCalledWith(ride);
  });

  it('deve lançar erro se a corrida não estiver em status REQUESTED', async () => {
    jest
      .spyOn(rideRepository, 'get')
      .mockResolvedValue({ getStatus: () => 'REQUESTED' } as any);
    await expect(
      acceptRideUseCase.execute({ driverId: 'fake', rideId: 'ride-id' })
    ).rejects.toThrow('Ride is not in requested status');
  });

  it('deve lançar erro se o motorista já tiver uma corrida ativa', async () => {
    jest
      .spyOn(rideRepository, 'get')
      .mockResolvedValue({ getStatus: () => 'IN_PROGRESS' } as any);
    jest
      .spyOn(rideRepository, 'hasActiveRideByDriverId')
      .mockResolvedValue(true);
    await expect(
      acceptRideUseCase.execute({ driverId: 'fake', rideId: 'ride-id' })
    ).rejects.toThrow('Driver already has an active ride');
  });

  it('deve lançar erro se a corrida não for encontrada', async () => {
    jest
      .spyOn(rideRepository, 'get')
      .mockResolvedValueOnce({ getStatus: () => 'IN_PROGRESS' } as any);
    jest
      .spyOn(rideRepository, 'hasActiveRideByDriverId')
      .mockResolvedValue(false);
    jest.spyOn(rideRepository, 'get').mockResolvedValueOnce(null);
    await expect(
      acceptRideUseCase.execute({ driverId: 'fake', rideId: 'ride-id' })
    ).rejects.toThrow('Ride not found');
  });
});

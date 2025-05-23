import { faker } from '@faker-js/faker/.';
import { AcceptRideUseCase } from '../../src/application/use-case/accept-ride-use-case';
import { User, UserTypeEnum } from '../../src/domain/entity/user';
import { RideRepository } from '../../src/infra/repository/ride-repository';
import { UserRepository } from '../../src/infra/repository/user-repository';
import { generateValidCPF } from '../unit/user.spec';
import { Ride, RideInput, RideStatusEnum } from '../../src/domain/entity/ride';

function makeUser(): User {
  return new User(
    faker.string.uuid(),
    faker.person.fullName(),
    faker.internet.email(),
    'ABC1234',
    UserTypeEnum.DRIVER,
    faker.internet.password(),
    generateValidCPF()
  );
}

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
  let userRepository: jest.Mocked<UserRepository>;
  let acceptRideUseCase: AcceptRideUseCase;

  beforeEach(() => {
    rideRepository = {
      create: jest.fn(),
      hasActiveRideByPassengerId: jest.fn(),
      get: jest.fn(),
      update: jest.fn(),
      hasActiveRideByDriverId: jest.fn(),
    } as any;
    userRepository = {
      create: jest.fn(),
      getUserByEmail: jest.fn(),
      getUserById: jest.fn(),
    };
    acceptRideUseCase = new AcceptRideUseCase(userRepository, rideRepository);
  });

  it('Deve aceitar uma corrida com sucesso', async () => {
    const ride = makeRide({});
    jest.spyOn(userRepository, 'getUserById').mockResolvedValue(makeUser());
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

  it('deve lançar erro se o usuário não for motorista', async () => {
    jest
      .spyOn(userRepository, 'getUserById')
      .mockResolvedValue({ type: UserTypeEnum.PASSENGER } as any);
    await expect(
      acceptRideUseCase.execute({ driverId: 'fake', rideId: 'ride-id' })
    ).rejects.toThrow('User is not a driver');
  });

  it('deve lançar erro se a corrida não estiver em status IN_PROGRESS', async () => {
    jest.spyOn(userRepository, 'getUserById').mockResolvedValue(makeUser());
    jest
      .spyOn(rideRepository, 'get')
      .mockResolvedValue({ getStatus: () => 'REQUESTED' } as any);
    await expect(
      acceptRideUseCase.execute({ driverId: 'fake', rideId: 'ride-id' })
    ).rejects.toThrow('Ride is not in requested status');
  });

  it('deve lançar erro se o motorista já tiver uma corrida ativa', async () => {
    jest.spyOn(userRepository, 'getUserById').mockResolvedValue(makeUser());
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
    jest.spyOn(userRepository, 'getUserById').mockResolvedValue(makeUser());
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

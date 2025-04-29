import { faker } from '@faker-js/faker/.';
import { Ride, RideStatusEnum } from '../../src/domain/entity/ride';
import { ValidationError } from '../../src/application/errors/validation-error';

describe('Ride', () => {
  it('Deve criar uma corrida', () => {
    const ride = Ride.create({
      id: faker.string.uuid(),
      passengerId: faker.string.uuid(),
      from: {
        lat: faker.number.float({ min: -90, max: 90 }),
        long: faker.number.float({ min: -90, max: 90 }),
      },
      to: {
        lat: faker.number.float({ min: -90, max: 90 }),
        long: faker.number.float({ min: -90, max: 90 }),
      },
      status: RideStatusEnum.IN_PROGRESS,
      dateRide: new Date(),
    });
    expect(ride).toBeInstanceOf(Ride);
    expect(ride.id).toBeDefined();
  });

  it('Não deve criar uma corrida se não houver um passengerId', () => {
    expect(() => {
      Ride.create({
        id: faker.string.uuid(),
        passengerId: '',
        from: {
          lat: faker.number.float({ min: -90, max: 90 }),
          long: faker.number.float({ min: -90, max: 90 }),
        },
        to: {
          lat: faker.number.float({ min: -90, max: 90 }),
          long: faker.number.float({ min: -90, max: 90 }),
        },
        status: RideStatusEnum.IN_PROGRESS,
        dateRide: new Date(),
      });
    }).toThrow(new ValidationError('Invalid passenger ID'));
  });

  it('Não deve criar uma corrida se não houver uma localizacão válida', () => {
    expect(() => {
      Ride.create({
        id: faker.string.uuid(),
        passengerId: faker.string.uuid(),
        from: {
          lat: NaN,
          long: NaN,
        },
        to: {
          lat: faker.number.float({ min: -90, max: 90 }),
          long: faker.number.float({ min: -90, max: 90 }),
        },
        status: RideStatusEnum.IN_PROGRESS,
        dateRide: new Date(),
      });
    }).toThrow(new ValidationError('Invalid location'));
  });
});

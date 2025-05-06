import { faker } from '@faker-js/faker/.';
import { Ride, RideStatusEnum } from '../../src/domain/entity/ride';
import { ValidationError } from '../../src/application/errors/validation-error';

describe('Ride', () => {
  it('Deve criar uma corrida', () => {
    const ride = Ride.create({
      id: faker.string.uuid(),
      passengerId: faker.string.uuid(),
      fromLat: faker.number.float({ min: -90, max: 90 }),
      fromLong: faker.number.float({ min: -90, max: 90 }),
      toLat: faker.number.float({ min: -90, max: 90 }),
      toLong: faker.number.float({ min: -90, max: 90 }),
      status: RideStatusEnum.IN_PROGRESS,
      dateRide: new Date(),
    });
    expect(ride).toBeInstanceOf(Ride);
    expect(ride.getRideId()).toBeDefined();
  });

  it('Não deve criar uma corrida se não houver um passengerId', () => {
    expect(() => {
      Ride.create({
        id: faker.string.uuid(),
        passengerId: '',
        fromLat: faker.number.float({ min: -90, max: 90 }),
        fromLong: faker.number.float({ min: -90, max: 90 }),
        toLat: faker.number.float({ min: -90, max: 90 }),
        toLong: faker.number.float({ min: -90, max: 90 }),
        status: RideStatusEnum.IN_PROGRESS,
        dateRide: new Date(),
      });
    }).toThrow(new ValidationError('Invalid passenger ID'));
  });
});

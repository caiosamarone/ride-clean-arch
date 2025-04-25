import request from 'supertest';
import { app } from '../src/main';
import { CreateUserInput } from '../src/use-case/create-user-use-case';
import { server } from '../src/server';

function makePassenger(
  params?: Partial<CreateUserInput>
): Partial<CreateUserInput> {
  return {
    name: 'John Doe',
    email: `johndoe${Math.random()}@gmail.com`,
    cpf: '37249087843',
    isDriver: false,
    isPassenger: true,
    password: 'admin',
    ...params,
  };
}

function makeDriver(
  params?: Partial<CreateUserInput>
): Partial<CreateUserInput> {
  return {
    name: 'John Doe',
    email: `johndoe${Math.random()}@gmail.com`,
    cpf: '37249087843',
    carPlate: 'ABD1234',
    isDriver: true,
    isPassenger: false,
    password: 'admin',
    ...params,
  };
}

describe('request-ride', () => {
  afterAll(() => {
    server.close();
  });

  it('Deve criar uma ride', async () => {
    const response = await request(app).post('/user').send(makePassenger());

    const input = {
      passengerId: response.body.id,
      from: {
        lat: -23.5505,
        long: -46.6333,
      },
      to: {
        lat: -23.5505,
        long: -46.6332,
      },
    };
    const result = await request(app).post('/ride').send(input);
    expect(result.body.rideId).toBeDefined();
  });

  it('Não deve criar uma ride se o passageiro já tiver uma ride em andamento', async () => {
    const response = await request(app).post('/user').send(makePassenger());
    const inputRide1 = {
      passengerId: response.body.id,
      from: {
        lat: -23.5505,
        long: -46.6333,
      },
      to: {
        lat: -23.5505,
        long: -46.6332,
      },
    };
    await request(app).post('/ride').send(inputRide1);
    const inputRide2 = {
      passengerId: response.body.id,
      from: {
        lat: -23.5505,
        long: -46.6333,
      },
      to: {
        lat: -23.5505,
        long: -46.6332,
      },
    };
    const result = await request(app).post('/ride').send(inputRide2);
    expect(result.status).toBe(429);
    expect(result.body.message).toBe('User already has a ride in progress');
  });

  it('Não deve criar uma ride se o passageiro não existir', async () => {
    const input = {
      passengerId: crypto.randomUUID(),
      from: {
        lat: -23.5505,
        long: -46.6333,
      },
      to: {
        lat: -23.5505,
        long: -46.6332,
      },
    };
    const result = await request(app).post('/ride').send(input);
    expect(result.status).toBe(404);
    expect(result.body.message).toBe('User not found');
  });

  it('Não deve criar uma ride se o passageiro nao for um passageiro', async () => {
    const response = await request(app).post('/user').send(makeDriver());
    const input = {
      passengerId: response.body.id,
      from: {
        lat: -23.5505,
        long: -46.6333,
      },
      to: {
        lat: -23.5505,
        long: -46.6332,
      },
    };
    const result = await request(app).post('/ride').send(input);
    expect(result.status).toBe(429);
    expect(result.body.message).toBe('User is not a passenger');
  });
});

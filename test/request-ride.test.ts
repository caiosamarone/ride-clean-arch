import axios from 'axios';

import { CreateUserInput } from '../src/use-case/create-user-use-case';

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
  it('Deve criar uma ride', async () => {
    const response = await axios.post(
      'http://localhost:3000/user',
      makePassenger()
    );

    const input = {
      passengerId: response.data.id,
      from: {
        lat: -23.5505,
        long: -46.6333,
      },
      to: {
        lat: -23.5505,
        long: -46.6332,
      },
    };
    const result = await axios.post('http://localhost:3000/ride', input);
    expect(result.data.rideId).toBeDefined();
  });

  it('Não deve criar uma ride se o passageiro já tiver uma ride em andamento', async () => {
    const response = await axios.post(
      'http://localhost:3000/user',
      makePassenger()
    );
    const inputRide1 = {
      passengerId: response.data.id,
      from: {
        lat: -23.5505,
        long: -46.6333,
      },
      to: {
        lat: -23.5505,
        long: -46.6332,
      },
    };
    await axios.post('http://localhost:3000/ride', inputRide1);
    const inputRide2 = {
      passengerId: response.data.id,
      from: {
        lat: -23.5505,
        long: -46.6333,
      },
      to: {
        lat: -23.5505,
        long: -46.6332,
      },
    };
    try {
      await axios.post('http://localhost:3000/ride', inputRide2);
    } catch (error: any) {
      expect(error.response.status).toBe(429);
      expect(error.response.data.message).toBe(
        'User already has a ride in progress'
      );
    }
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
    try {
      await axios.post('http://localhost:3000/ride', input);
    } catch (error: any) {
      expect(error.response.status).toBe(404);
      expect(error.response.data.message).toBe('User not found');
    }
  });

  it('Não deve criar uma ride se o passageiro nao for um passageiro', async () => {
    const response = await axios.post(
      'http://localhost:3000/user',
      makeDriver()
    );
    const input = {
      passengerId: response.data.id,
      from: {
        lat: -23.5505,
        long: -46.6333,
      },
      to: {
        lat: -23.5505,
        long: -46.6332,
      },
    };
    try {
      await axios.post('http://localhost:3000/ride', input);
    } catch (error: any) {
      expect(error.response.status).toBe(429);
      expect(error.response.data.message).toBe('User is not a passenger');
    }
  });
});

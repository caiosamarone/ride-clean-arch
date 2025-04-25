import axios from 'axios';
import { Account } from '../src/main';

describe('create-user', () => {
  it('Deve criar uma conta de passageiro', async () => {
    const input: Partial<Account> = {
      name: 'John Doe',
      email: `johndoe${Math.random()}@gmail.com`,
      cpf: '37249087843',
      isDriver: false,
      isPassenger: true,
      password: 'admin',
    };
    const result = await axios.post('http://localhost:3000/user', input);
    const account = await axios.get(
      `http://localhost:3000/user/${result.data.id}`
    );
    expect(result.data.id).toEqual(expect.any(String));
    expect(account.data.name).toBe(input.name);
  });

  it('Deve criar uma conta de motorista', async () => {
    const input: Partial<Account> = {
      name: 'John Doe',
      email: `johndose${Math.random()}@gmail.com`,
      cpf: '37249087843',
      carPlate: 'ABD1234',
      isDriver: true,
      isPassenger: false,
      password: 'admin',
    };
    const result = await axios.post('http://localhost:3000/user', input);
    const response = await axios.get(
      `http://localhost:3000/user/${result.data.id}`
    );
    expect(result.data.id).toEqual(expect.any(String));
    expect(response.data.name).toBe(input.name);
  });

  it('Não Deve criar uma conta de motorista sem placa', async () => {
    const input: Partial<Account> = {
      name: 'John Doe',
      email: `johndoe${Math.random()}@gmail.com`,
      cpf: '37249087843',
      isDriver: true,
      isPassenger: false,
      password: 'admin',
    };

    try {
      await axios.post('http://localhost:3000/user', input);
    } catch (error: any) {
      expect(error.response.status).toBe(429);
      expect(error.response.data.message).toBe('Invalid car plate');
    }
  });
});

import axios from 'axios';
import { CreateUserInput } from '../../src/application/use-case/create-user-use-case';

const BASE_URL = 'http://localhost:3000';

describe('[POST] /user', () => {
  it('Deve criar uma conta de passageiro', async () => {
    const input: Partial<CreateUserInput> = {
      name: 'John Doe',
      email: `johndoe${Math.random()}@gmail.com`,
      cpf: '37249087843',
      isDriver: false,
      isPassenger: true,
      password: 'admin',
    };
    const result = await axios.post(`${BASE_URL}/user`, input);
    const account = await axios.get(`${BASE_URL}/user/${result.data.userId}`);
    expect(result.data.userId).toEqual(expect.any(String));
    expect(account.data.name).toBe(input.name);
  });

  it('Deve criar uma conta de motorista', async () => {
    const input: Partial<CreateUserInput> = {
      name: 'John Doe',
      email: `johndose${Math.random()}@gmail.com`,
      cpf: '37249087843',
      carPlate: 'ABD1234',
      isDriver: true,
      isPassenger: false,
      password: 'admin',
    };
    const result = await axios.post(`${BASE_URL}/user`, input);
    const response = await axios.get(`${BASE_URL}/user/${result.data.userId}`);
    expect(result.data.userId).toEqual(expect.any(String));
    expect(response.data.name).toBe(input.name);
  });
});

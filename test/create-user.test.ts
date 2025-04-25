import request from 'supertest';
import { app } from '../src/infra/main';
import { server } from '../src/server';
import { CreateUserInput } from '../src/application/use-case/create-user-use-case';

describe('create-user', () => {
  afterAll(() => {
    server.close();
  });

  it('Deve criar uma conta de passageiro', async () => {
    const input: Partial<CreateUserInput> = {
      name: 'John Doe',
      email: `johndoe${Math.random()}@gmail.com`,
      cpf: '37249087843',
      isDriver: false,
      isPassenger: true,
      password: 'admin',
    };
    const result = await request(app).post('/user').send(input);
    const account = await request(app).get(`/user/${result.body.id}`);
    expect(result.body.id).toEqual(expect.any(String));
    expect(account.body.name).toBe(input.name);
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
    const result = await request(app).post('/user').send(input);
    const response = await request(app).get(`/user/${result.body.id}`);
    expect(result.body.id).toEqual(expect.any(String));
    expect(response.body.name).toBe(input.name);
  });
});

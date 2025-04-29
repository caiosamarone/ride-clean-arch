import {
  CreateUserUseCase,
  CreateUserInput,
} from '../../src/application/use-case/create-user-use-case';
import { UserRepository } from '../../src/infra/repository/user-repository';
import { UserAlreadyExists } from '../../src/application/errors/user-already-exists';

describe('CreateUserUseCase', () => {
  let userRepository: jest.Mocked<UserRepository>;
  let createUserUseCase: CreateUserUseCase;

  beforeEach(() => {
    userRepository = {
      getUserByEmail: jest.fn(),
      create: jest.fn(),
    } as any;
    createUserUseCase = new CreateUserUseCase(userRepository);
  });

  it('Deve criar um usuário com sucesso', async () => {
    const input: CreateUserInput = {
      name: 'John Doe',
      email: 'john@example.com',
      cpf: '37249087843',
      carPlate: 'ABC1234',
      isPassenger: true,
      isDriver: false,
      password: 'admin',
    };
    userRepository.getUserByEmail.mockResolvedValue(null);
    userRepository.create.mockResolvedValue(undefined);

    const output = await createUserUseCase.execute(input);
    expect(output.userId).toEqual(expect.any(String));
    expect(userRepository.getUserByEmail).toHaveBeenCalledWith(input.email);
    expect(userRepository.create).toHaveBeenCalled();
  });

  it('Não deve criar um usuário se o e-mail já existir', async () => {
    const input: CreateUserInput = {
      name: 'Jane Doe',
      email: 'jane@example.com',
      cpf: '37249087843',
      carPlate: 'DEF5678',
      isPassenger: true,
      isDriver: false,
      password: 'admin',
    };
    userRepository.getUserByEmail.mockResolvedValue({
      id: 'existing-user-id',
    } as any);
    await expect(createUserUseCase.execute(input)).rejects.toThrow(
      UserAlreadyExists
    );
    expect(userRepository.getUserByEmail).toHaveBeenCalledWith(input.email);
    expect(userRepository.create).not.toHaveBeenCalled();
  });
});

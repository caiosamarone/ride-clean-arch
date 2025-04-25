import { PgPromiseUserRepository } from '../../infra/repository/pg-promise-user-repository';
import { CreateUserUseCase } from '../use-case/create-user-use-case';

export function makeCreateUserUseCaseFactory(): CreateUserUseCase {
  const userRepository = new PgPromiseUserRepository();
  const createUserUseCase = new CreateUserUseCase(userRepository);
  return createUserUseCase;
}

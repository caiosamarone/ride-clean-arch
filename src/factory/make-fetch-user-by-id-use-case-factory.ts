import { PgPromiseUserRepository } from '../repository/pg-promise-user-repository';
import { FetchUserByIdUseCase } from '../use-case/fetch-user-by-id-use-case';

export function makeFetchUserByIdUseCaseFactory(): FetchUserByIdUseCase {
  const userRepository = new PgPromiseUserRepository();
  const fetchUserByIdUseCase = new FetchUserByIdUseCase(userRepository);
  return fetchUserByIdUseCase;
}

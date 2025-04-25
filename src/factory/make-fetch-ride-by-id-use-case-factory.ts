import { PgPromiseRideRepository } from '../repository/pg-promise-ride-repository';
import { PgPromiseUserRepository } from '../repository/pg-promise-user-repository';
import { FecthRideByIdUseCase } from '../use-case/fetch-ride-by-id-use-case';

export function makeFetchRideByIdUseCaseFactory(): FecthRideByIdUseCase {
  const rideRepository = new PgPromiseRideRepository();
  const userRepository = new PgPromiseUserRepository();
  const fetchRideByIdUseCase = new FecthRideByIdUseCase(
    rideRepository,
    userRepository
  );
  return fetchRideByIdUseCase;
}

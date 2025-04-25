import { PgPromiseRideRepository } from '../../infra/repository/pg-promise-ride-repository';
import { PgPromiseUserRepository } from '../../infra/repository/pg-promise-user-repository';
import { RequestRideUseCase } from '../use-case/request-ride-use-case';

export function makeRequestRideUseCaseFactory(): RequestRideUseCase {
  const userRepository = new PgPromiseUserRepository();
  const rideRepository = new PgPromiseRideRepository();
  const requestRideUseCase = new RequestRideUseCase(
    rideRepository,
    userRepository
  );
  return requestRideUseCase;
}

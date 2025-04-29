import { User } from '../../domain/entity/user';
import { UserRepository } from '../../infra/repository/user-repository';

export type FecthRideByIdUseCaseOutput = {
  user: User;
};

export class FetchUserByIdUseCase {
  constructor(private readonly userRepository: UserRepository) {}

  async execute(userId: string): Promise<User> {
    const user = await this.userRepository.getUserById(userId);
    if (!user) {
      throw new Error('User not found');
    }
    return user;
  }
}

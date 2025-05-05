import { User, UserTypeEnum } from '../../domain/entity/user';
import { UserRepository } from '../../infra/repository/user-repository';

export type FecthRideByIdUseCaseOutput = {
  id: string;
  name: string;
  email: string;
  cpf: string;
  password: string;
  carPlate: string;
  isPassenger: boolean;
  isDriver: boolean;
};

export class FetchUserByIdUseCase {
  constructor(private readonly userRepository: UserRepository) {}

  async execute(userId: string): Promise<FecthRideByIdUseCaseOutput> {
    const user = await this.userRepository.getUserById(userId);
    if (!user) {
      throw new Error('User not found');
    }
    return {
      id: user.id,
      name: user.getName(),
      email: user.getEmail(),
      cpf: user.getCpf(),
      carPlate: user.getCarPlate(),
      password: user.getPassword(),
      isPassenger: UserTypeEnum.PASSENGER === user.type,
      isDriver: UserTypeEnum.DRIVER === user.type,
    };
  }
}

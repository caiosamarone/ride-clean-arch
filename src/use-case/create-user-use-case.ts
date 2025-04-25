import { User } from '../entity/user';

import { UserAlreadyExists } from '../errors/user-already-exists';
import { UserRepository } from '../repository/user-repository';

export type CreateUserInput = {
  name: string;
  email: string;
  cpf: string;
  carPlate: string;
  isPassenger: boolean;
  isDriver: boolean;
  password: string;
};

export type CreateUserOutput = {
  userId: string;
};

export class CreateUserUseCase {
  constructor(private readonly userRepository: UserRepository) {}

  async execute(input: CreateUserInput): Promise<CreateUserOutput> {
    const existingUser = await this.userRepository.getUserByEmail(input.email);
    if (existingUser) {
      throw new UserAlreadyExists();
    }
    const user = User.create({
      carPlate: input.carPlate,
      cpf: input.cpf,
      email: input.email,
      name: input.name,
      password: input.password,
      isDriver: input.isDriver,
      isPassenger: input.isPassenger,
    });

    await this.userRepository.create(user);
    return {
      userId: user.id,
    };
  }
}

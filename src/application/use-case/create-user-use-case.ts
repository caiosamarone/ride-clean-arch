import { User } from '../../domain/entity/user';
import MailerGateway from '../../infra/gateway/mailer-gateway';
import { UserRepository } from '../../infra/repository/user-repository';
import { UserAlreadyExists } from '../errors/user-already-exists';

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
  constructor(
    private readonly userRepository: UserRepository,
    private readonly mailerGateway: MailerGateway
  ) {}

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
    await this.mailerGateway.send(user.getEmail(), 'Welcome', '...');
    return {
      userId: user.id,
    };
  }
}

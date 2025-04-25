import { InvalidCarPlate } from '../errors/invalid-car-plate';
import { ValidationError } from '../errors/validation-error';
import { validateCpf } from '../validateCpf';

export enum UserTypeEnum {
  PASSENGER = 'passenger',
  DRIVER = 'driver',
}
export type UserInput = {
  name: string;
  email: string;
  carPlate: string;
  password: string;
  cpf: string;
  isPassenger: boolean;
  isDriver: boolean;
};

export class User {
  constructor(
    readonly id: string,
    readonly name: string,
    readonly email: string,
    readonly carPlate: string,
    readonly type: UserTypeEnum,
    readonly password: string,
    readonly cpf: string
  ) {
    if (!this.isValidName(name)) {
      throw new ValidationError('Invalid name');
    }
    if (!this.isValidEmail(email)) {
      throw new ValidationError('Invalid e-mail');
    }
    if (!validateCpf(cpf)) {
      throw new ValidationError('Invalid CPF');
    }
    if (type === UserTypeEnum.DRIVER && !this.isValidCarPlate(carPlate)) {
      throw new InvalidCarPlate();
    }
  }

  isValidName(name: string) {
    return name?.match(/[a-zA-Z] [a-zA-Z]+/);
  }
  isValidEmail(email: string) {
    return email?.match(/^(.+)@(.+)$/);
  }
  isValidCarPlate(carPlate: string) {
    return carPlate?.match(/[A-Z]{3}[0-9]{4}/);
  }

  static create(props: UserInput): User {
    const { carPlate, cpf, email, name, password } = props;
    const id = crypto.randomUUID();
    const type = props.isPassenger
      ? UserTypeEnum.PASSENGER
      : UserTypeEnum.DRIVER;
    return new User(id, name, email, carPlate, type, password, cpf);
  }
}

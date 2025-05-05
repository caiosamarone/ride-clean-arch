import { InvalidCarPlate } from '../../application/errors/invalid-car-plate';
import { ValidationError } from '../../application/errors/validation-error';
import { validateCpf } from '../../helpers/validate-cpf';
import { CarPlate } from '../value-objects/car-plate';
import Cpf from '../value-objects/cpf';
import { Email } from '../value-objects/email';
import { Name } from '../value-objects/name';
import { Password } from '../value-objects/password';

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
  private name: Name;
  private email: Email;
  private cpf: Cpf;
  private carPlate: CarPlate;
  private password: Password;

  constructor(
    readonly id: string,
    name: string,
    email: string,
    carPlate: string,
    readonly type: UserTypeEnum,
    password: string,
    cpf: string
  ) {
    this.name = new Name(name);
    this.email = new Email(email);
    this.cpf = new Cpf(cpf);
    this.carPlate = new CarPlate(carPlate);
    this.password = new Password(password);
  }

  static create(props: UserInput): User {
    const { carPlate, cpf, email, name, password } = props;
    const id = crypto.randomUUID();
    const type = props.isPassenger
      ? UserTypeEnum.PASSENGER
      : UserTypeEnum.DRIVER;
    return new User(id, name, email, carPlate, type, password, cpf);
  }

  getName() {
    return this.name.getValue();
  }
  getEmail() {
    return this.email.getValue();
  }

  getPassword() {
    return this.password.getValue();
  }
  getCpf() {
    return this.cpf.getValue();
  }
  getCarPlate() {
    return this.carPlate.getValue();
  }
}

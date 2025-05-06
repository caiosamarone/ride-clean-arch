import { CarPlate } from '../value-objects/car-plate';
import Cpf from '../value-objects/cpf';
import { Email } from '../value-objects/email';
import { Name } from '../value-objects/name';
import { Password } from '../value-objects/password';
import { UUID } from '../value-objects/UUID';

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
  private id: UUID;
  private name: Name;
  private email: Email;
  private cpf: Cpf;
  private carPlate: CarPlate;
  private password: Password;

  constructor(
    id: string,
    name: string,
    email: string,
    carPlate: string,
    readonly type: UserTypeEnum,
    password: string,
    cpf: string
  ) {
    this.id = new UUID(id);
    this.name = new Name(name);
    this.email = new Email(email);
    this.cpf = new Cpf(cpf);
    this.carPlate = new CarPlate(carPlate);
    this.password = new Password(password);
  }

  static create(props: UserInput): User {
    const { carPlate, cpf, email, name, password } = props;
    const id = UUID.create();
    const type = props.isPassenger
      ? UserTypeEnum.PASSENGER
      : UserTypeEnum.DRIVER;
    return new User(id.getValue(), name, email, carPlate, type, password, cpf);
  }

  getId() {
    return this.id.getValue();
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

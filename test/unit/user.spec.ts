import { faker } from '@faker-js/faker/.';
import { User } from '../../src/domain/entity/user';

import { ValidationError } from '../../src/application/errors/validation-error';
export function generateValidCPF(): string {
  const randomDigits = () => Math.floor(Math.random() * 9);
  const cpf = Array.from({ length: 9 }, randomDigits);

  const calculateDigit = (base: number[]) => {
    const sum = base.reduce(
      (acc, digit, index) => acc + digit * (base.length + 1 - index),
      0
    );
    const remainder = sum % 11;
    return remainder < 2 ? 0 : 11 - remainder;
  };

  const firstDigit = calculateDigit(cpf);
  const secondDigit = calculateDigit([...cpf, firstDigit]);

  return [...cpf, firstDigit, secondDigit].join('');
}

describe('User', () => {
  it('Deve criar um usuário', () => {
    const user = User.create({
      carPlate: 'ABD1234',
      cpf: generateValidCPF(),
      email: faker.internet.email(),
      name: faker.person.fullName(),
      password: faker.internet.password(),
      isDriver: true,
      isPassenger: false,
    });
    expect(user).toBeInstanceOf(User);
    expect(user.getId()).toBeDefined();
    expect(user.getName()).toBeDefined();
  });

  it('Não deve criar um usuário com nome inválido', () => {
    expect(() => {
      User.create({
        carPlate: 'ABD1234',
        cpf: generateValidCPF(),
        email: faker.internet.email(),
        name: 'InvalidName123',
        password: faker.internet.password(),
        isDriver: true,
        isPassenger: false,
      });
    }).toThrow(new ValidationError('Invalid name'));
  });

  it('Não deve criar um usuário com cpf inválido', () => {
    expect(() => {
      User.create({
        carPlate: 'ABD1234',
        cpf: '12345678901',
        email: faker.internet.email(),
        name: faker.person.fullName(),
        password: faker.internet.password(),
        isDriver: true,
        isPassenger: false,
      });
    }).toThrow(new ValidationError('Invalid CPF'));
  });

  it('Não deve criar um usuário com cpf inválido', () => {
    expect(() => {
      User.create({
        carPlate: 'ABD1234',
        cpf: '12345678901',
        email: faker.internet.email(),
        name: faker.person.fullName(),
        password: faker.internet.password(),
        isDriver: true,
        isPassenger: false,
      });
    }).toThrow(new ValidationError('Invalid CPF'));
  });

  it('Não deve criar um usuário com email inválido', () => {
    expect(() => {
      User.create({
        carPlate: 'ABD1234',
        cpf: '12345678901',
        email: 'invalid-email',
        name: faker.person.fullName(),
        password: faker.internet.password(),
        isDriver: true,
        isPassenger: false,
      });
    }).toThrow(new ValidationError('Invalid e-mail'));
  });
});

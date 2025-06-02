import Cpf from '../../src/domain/value-objects/cpf';

test('Deve validar um cpf com o digito diferente de zero', function () {
  const cpf = '97456321558';
  const input = new Cpf(cpf);
  expect(input.getValue()).toBeDefined();
});

test('Deve validar um cpf com o segundo digito zero', function () {
  const cpf = '71428793860';
  const input = new Cpf(cpf);
  expect(input.getValue()).toBeDefined();
});

test('Deve validar um cpf com o primeiro digito zero', function () {
  const cpf = '87748248800';
  const input = new Cpf(cpf);
  expect(input.getValue()).toBeDefined();
});

test('Não deve validar um cpf com menos de 11 caracteres', function () {
  const cpf = '9745632155';
  expect(() => new Cpf(cpf)).toThrow(new Error('Invalid CPF'));
});

test('Não deve validar um cpf com todos os caracteres iguais', function () {
  const cpf = '11111111111';
  expect(() => new Cpf(cpf)).toThrow(new Error('Invalid CPF'));
});

test('Não deve validar um cpf com letras', function () {
  const cpf = '97a56321558';
  expect(() => new Cpf(cpf)).toThrow(new Error('Invalid CPF'));
});

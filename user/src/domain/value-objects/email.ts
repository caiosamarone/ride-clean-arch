export class Email {
  private value: string;

  constructor(email: string) {
    if (!this.isValidEmail(email)) {
      throw new Error('Invalid e-mail');
    }
    this.value = email;
  }

  isValidEmail(email: string) {
    return email?.match(/^(.+)@(.+)$/);
  }

  getValue() {
    return this.value;
  }
}

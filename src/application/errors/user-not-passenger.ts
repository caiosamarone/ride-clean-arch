export class UserNotPassengerError extends Error {
  constructor() {
    super('User is not a passenger')
    this.name = 'UserNotPassengerError'
  }
}

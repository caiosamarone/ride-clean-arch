export class UserWithActiveRide extends Error {
  constructor() {
    super('User already has a ride in progress')
  }
}

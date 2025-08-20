import { UUID } from '../value-objects/UUID';

export class Transaction {
  private rideId: UUID;
  private transactionId: UUID;

  constructor(
    transactionId: string,
    rideId: string,
    readonly amount: number,
    readonly status: string,
    readonly date: Date
  ) {
    this.rideId = new UUID(rideId);
    this.transactionId = new UUID(transactionId);
  }

  static create(rideId: string, amount: number): Transaction {
    const transactionId = UUID.create().getValue();
    const status = 'waiting_payment';
    const date = new Date();
    return new Transaction(transactionId, rideId, amount, status, date);
  }

  getTransactionId(): string {
    return this.transactionId.getValue();
  }

  getRideId(): string {
    return this.rideId.getValue();
  }
}

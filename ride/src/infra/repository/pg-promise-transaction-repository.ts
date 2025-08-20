import { Transaction } from '../../domain/entity/transaction';
import DatabaseConnection from '../database/pg-promise';
import TransactionRepository from './transaction-repository';

export class PgPromiseTransactionRepository implements TransactionRepository {
  constructor(readonly db: DatabaseConnection) {}

  async saveTransaction(transaction: Transaction): Promise<void> {
    await this.db.query(
      'insert into ccca.transaction (transaction_id, ride_id, amount, status, date) values ($1, $2, $3, $4, $5)',
      [
        transaction.getTransactionId(),
        transaction.getRideId(),
        transaction.amount,
        transaction.status,
        transaction.date,
      ]
    );
  }
  async getTransactionById(transactionId: string): Promise<Transaction> {
    const [transactionData] = await this.db.query(
      'select * from ccca.transaction where transaction_id = $1',
      [transactionId]
    );
    return new Transaction(
      transactionData.transaction_id,
      transactionData.ride_id,
      parseFloat(transactionData.amount),
      transactionData.status,
      transactionData.date
    );
  }
}

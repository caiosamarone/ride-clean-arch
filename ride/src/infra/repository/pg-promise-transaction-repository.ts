import { Transaction } from '../../domain/entity/transaction';
import DatabaseConnection from '../database/pg-promise';
import { inject } from '../di/registry';
import ORM, { TransactionModel } from '../orm/ORM';
import TransactionRepository from './transaction-repository';

export class PgPromiseTransactionRepository implements TransactionRepository {
  @inject('orm')
  orm!: ORM;

  async saveTransaction(transaction: Transaction): Promise<void> {
    await this.orm.save(TransactionModel.fromAggregate(transaction));
  }
  async getTransactionById(transactionId: string): Promise<Transaction> {
    const transaction = await this.orm.get(
      TransactionModel,
      'transaction_id',
      transactionId
    );
    return transaction.toAggregate();
  }

  async getTransactionByRideId(rideId: string): Promise<Transaction> {
    const transaction = await this.orm.get(TransactionModel, 'ride_id', rideId);
    return transaction.toAggregate();
  }
}

import { Transaction } from '../../domain/entity/transaction';

export default interface TransactionRepository {
  saveTransaction(transaction: Transaction): Promise<void>;
  getTransactionById(transactionId: string): Promise<Transaction>;
}

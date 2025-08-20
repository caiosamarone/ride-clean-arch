import { Transaction } from '../../domain/entity/transaction';
import { PaymentGateway } from '../../infra/gateway/payment-gateway';
import TransactionRepository from '../../infra/repository/transaction-repository';

type Output = {
  transactionId: string;
  rideId: string;
  amount: number;
  date: Date;
  status: string;
};

export class GetTransactionUseCase {
  constructor(private readonly transactionRepository: TransactionRepository) {}

  async execute(transactionId: string): Promise<Output> {
    const transaction =
      await this.transactionRepository.getTransactionById(transactionId);
    return {
      amount: transaction.amount,
      date: transaction.date,
      rideId: transaction.getRideId(),
      status: transaction.status,
      transactionId: transaction.getTransactionId(),
    };
  }
}

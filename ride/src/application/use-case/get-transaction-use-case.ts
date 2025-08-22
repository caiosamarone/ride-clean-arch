import { Transaction } from '../../domain/entity/transaction';
import { inject } from '../../infra/di/registry';
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
  @inject('transactionRepository')
  transactionRepository!: TransactionRepository;
  constructor() {}

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

import { Transaction } from '../../domain/entity/transaction';
import { inject } from '../../infra/di/registry';
import { PaymentGateway } from '../../infra/gateway/payment-gateway';
import TransactionRepository from '../../infra/repository/transaction-repository';

type Input = {
  rideId: string;
  amount: number;
};

type Output = {
  transactionId: string;
};

export class ProcessPaymentUseCase {
  @inject('transactionRepository')
  transactionRepository!: TransactionRepository;

  async execute(input: Input): Promise<Output> {
    const transaction = Transaction.create(input.rideId, input.amount);
    await this.transactionRepository.saveTransaction(transaction);
    return {
      transactionId: transaction.getTransactionId(),
    };
  }
}

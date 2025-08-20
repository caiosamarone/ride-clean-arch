import { GetTransactionUseCase } from '../../src/application/use-case/get-transaction-use-case';
import { ProcessPaymentUseCase } from '../../src/application/use-case/process-ride-payment-use-case';
import { UUID } from '../../src/domain/value-objects/UUID';
import { PgPromiseAdapter } from '../../src/infra/database/pg-promise';
import { PgPromiseTransactionRepository } from '../../src/infra/repository/pg-promise-transaction-repository';

describe('ProcessPaymentUseCase', () => {
  it('deve processar o pagamento', async function () {
    const connection = new PgPromiseAdapter();
    const transactionRepository = new PgPromiseTransactionRepository(
      connection
    );
    const processPayment = new ProcessPaymentUseCase(transactionRepository);
    const getTransaction = new GetTransactionUseCase(transactionRepository);
    const inputProcessPayment = {
      rideId: UUID.create().getValue(),
      amount: 100,
    };
    const outputProcessPayment =
      await processPayment.execute(inputProcessPayment);
    const outputGetTransaction = await getTransaction.execute(
      outputProcessPayment.transactionId
    );
    expect(outputGetTransaction.rideId).toBe(inputProcessPayment.rideId);
    expect(outputGetTransaction.amount).toBe(inputProcessPayment.amount);
  });
});

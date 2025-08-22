import { Transaction } from '../../src/domain/entity/transaction';
import { UUID } from '../../src/domain/value-objects/UUID';
import { PgPromiseAdapter } from '../../src/infra/database/pg-promise';
import ORM, { TransactionModel } from '../../src/infra/orm/ORM';

test('Deve inserir um registro num banco de dados', async () => {
  const connection = new PgPromiseAdapter();
  const orm = new ORM(connection);
  const transaction = Transaction.create(UUID.create().getValue(), 100);
  await orm.save(TransactionModel.fromAggregate(transaction));
  const savedTransaction = await orm.get(
    TransactionModel,
    'transaction_id',
    transaction.getTransactionId()
  );
  expect(savedTransaction.amount).toBe(100);
  console.log(savedTransaction.toAggregate());
  await connection.close();
});

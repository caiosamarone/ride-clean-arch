import { PaymentGateway } from '../../infra/gateway/payment-gateway';

type Input = {
  rideId: string;
  creditCardToken: string;
  amount: number;
};

export class ProcessRidePaymentUseCase {
  constructor(private readonly paymentGateway: PaymentGateway) {}

  async execute(input: Input): Promise<boolean> {
    const { rideId, creditCardToken, amount } = input;
    return await this.paymentGateway.process(creditCardToken, amount, rideId);
  }
}

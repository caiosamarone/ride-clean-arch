export interface PaymentGateway {
  process(
    creditCardTokenToken: string,
    amount: number,
    rideId: string
  ): Promise<boolean>;
}

export class PaymentGatewayMemory implements PaymentGateway {
  async process(
    creditCardToken: string,
    amount: number,
    rideId: string
  ): Promise<boolean> {
    console.log(
      'Payment processed with token:',
      creditCardToken,
      amount,
      rideId
    );
    return true;
  }
}

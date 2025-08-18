import HttpClient from '../http/http-client';

export interface UserGateway {
  getUserById(userId: string): Promise<GetUserByIdOutput>;
  signup(input: CreateUserInput): Promise<string>;
}

export class UserGatewayHttp implements UserGateway {
  constructor(readonly httpClient: HttpClient) {}

  async getUserById(userId: string): Promise<any> {
    const response = await this.httpClient.get(
      `http://localhost:3000/user/${userId}`
    );
    return response;
  }
  async signup(input: CreateUserInput): Promise<any> {
    const response = await this.httpClient.post(
      'http://localhost:3000/user',
      input
    );
    return response;
  }
}

type CreateUserInput = {
  name: string;
  email: string;
  cpf: string;
  carPlate: string;
  isPassenger: boolean;
  isDriver: boolean;
  password: string;
};

type GetUserByIdOutput = {
  id: string;
  name: string;
  email: string;
  cpf: string;
  carPlate?: string;
  isPassenger?: boolean;
  isDriver?: boolean;
};

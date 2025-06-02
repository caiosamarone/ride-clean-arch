import axios from 'axios';

export interface UserGateway {
  getUserById(userId: string): Promise<GetUserByIdOutput>;
  signup(input: CreateUserInput): Promise<string>;
}

export class UserGatewayHttp implements UserGateway {
  async getUserById(userId: string): Promise<any> {
    const response = await axios.get<GetUserByIdOutput>(
      `http://localhost:3000/user/${userId}`
    );
    return response.data;
  }
  async signup(input: CreateUserInput): Promise<any> {
    const response = await axios.post('http://localhost:3000/user', input);
    return response.data;
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

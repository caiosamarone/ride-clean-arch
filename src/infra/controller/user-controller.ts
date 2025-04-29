import { CreateUserUseCase } from '../../application/use-case/create-user-use-case';
import { FetchUserByIdUseCase } from '../../application/use-case/fetch-user-by-id-use-case';
import HttpServer from '../http/http-server';

//Interface Adapter
export default class UserController {
  constructor(
    readonly httpServer: HttpServer,
    readonly createUserUseCase: CreateUserUseCase,
    readonly fetchUserByIdUseCase: FetchUserByIdUseCase
  ) {
    httpServer.register('post', '/user', async (params: any, body: any) => {
      const output = await createUserUseCase.execute(body);
      return output;
    });

    httpServer.register('get', '/user/:{id}', async (params: any) => {
      const output = await fetchUserByIdUseCase.execute(params.id);
      return output;
    });
  }
}

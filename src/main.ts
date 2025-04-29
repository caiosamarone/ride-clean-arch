import { CreateUserUseCase } from './application/use-case/create-user-use-case';
import { FetchUserByIdUseCase } from './application/use-case/fetch-user-by-id-use-case';
import UserController from './infra/controller/user-controller';
import { PgPromiseAdapter } from './infra/database/pg-promise';
import { MailerGatewayMemory } from './infra/gateway/mailer-gateway';
import { ExpressAdapter } from './infra/http/http-server';
import { PgPromiseUserRepository } from './infra/repository/pg-promise-user-repository';

const httpServer = new ExpressAdapter();
// const httpServer = new HapiAdapter();
const connection = new PgPromiseAdapter();
const userRepository = new PgPromiseUserRepository(connection);
const mailerGateway = new MailerGatewayMemory();
const createUser = new CreateUserUseCase(userRepository, mailerGateway);
const getUser = new FetchUserByIdUseCase(userRepository);
new UserController(httpServer, createUser, getUser);
httpServer.listen(3000);

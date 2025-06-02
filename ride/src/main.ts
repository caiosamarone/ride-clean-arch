import { ExpressAdapter } from './infra/http/http-server';

const httpServer = new ExpressAdapter();

httpServer.listen(3000);

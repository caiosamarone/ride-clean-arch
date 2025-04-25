import { pgp } from './infra/database/pg-promise';
import { app } from './infra/main';

const PORT = 3000;

const server = app.listen(PORT, () => {
  console.log(`Server is running on http://localhost:${PORT}`);
});

server.on('close', async () => {
  pgp.end();
});

export { server };

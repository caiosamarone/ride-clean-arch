import { pgp } from '../database/pg-promise';
import { app } from './main';

const PORT = 3000;

const server = app.listen(PORT, () => {
  console.log(`Server is running on http://localhost:${PORT}`);
});

server.on('close', async () => {
  pgp.end();
});

export { server };

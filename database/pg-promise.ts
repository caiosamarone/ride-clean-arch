import pgPromise from 'pg-promise';
import { CONNECTION_STRING } from '../environment';

const pgp = pgPromise();
const db = pgp(CONNECTION_STRING); // Substitua pela sua string de conexão

export { db, pgp };

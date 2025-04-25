import pgp from 'pg-promise';
import { CONNECTION_STRING } from '../environment';

const pgPromise = pgp();
const db = pgPromise(CONNECTION_STRING);

export default db;

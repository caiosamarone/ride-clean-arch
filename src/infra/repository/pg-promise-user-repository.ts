import { db } from '../database/pg-promise';

import { User, UserTypeEnum } from '../../domain/entity/user';
import { UserRepository } from './user-repository';

export class PgPromiseUserRepository implements UserRepository {
  private db: any;

  constructor() {
    this.db = db;
  }
  async create(user: User): Promise<void> {
    await db.query(
      'insert into ccca.account (account_id, name, email, cpf, car_plate, is_passenger, is_driver, password) values ($1, $2, $3, $4, $5, $6, $7, $8)',
      [
        user.id,
        user.name,
        user.email,
        user.cpf,
        user.carPlate,
        user.type === UserTypeEnum.PASSENGER,
        user.type === UserTypeEnum.DRIVER,
        user.password,
      ]
    );
  }

  async getUserById(userId: string): Promise<User | null> {
    const [user] = await this.db.query(
      'select * from ccca.account where account_id = $1',
      [userId]
    );
    if (!user) {
      return null;
    }
    return new User(
      user.account_id,
      user.name,
      user.email,
      user.car_plate,
      user.is_driver ? UserTypeEnum.DRIVER : UserTypeEnum.PASSENGER,
      user.password,
      user.cpf
    );
  }

  async getUserByEmail(email: string): Promise<User | null> {
    const [user] = await this.db.query(
      'select * from ccca.account where email = $1',
      [email]
    );
    if (!user) {
      return null;
    }
    return new User(
      user.account_id,
      user.name,
      user.email,
      user.car_plate,
      user.is_driver ? UserTypeEnum.DRIVER : UserTypeEnum.PASSENGER,
      user.password,
      user.cpf
    );
  }
}

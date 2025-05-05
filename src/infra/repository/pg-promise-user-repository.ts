import DatabaseConnection from '../database/pg-promise';

import { User, UserTypeEnum } from '../../domain/entity/user';
import { UserRepository } from './user-repository';

export class PgPromiseUserRepository implements UserRepository {
  constructor(readonly db: DatabaseConnection) {}

  async create(user: User): Promise<void> {
    await this.db.query(
      'insert into ccca.account (account_id, name, email, cpf, car_plate, is_passenger, is_driver, password) values ($1, $2, $3, $4, $5, $6, $7, $8)',
      [
        user.id,
        user.getName(),
        user.getEmail(),
        user.getCpf(),
        user.getCarPlate(),
        user.type === UserTypeEnum.PASSENGER,
        user.type === UserTypeEnum.DRIVER,
        user.getPassword(),
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

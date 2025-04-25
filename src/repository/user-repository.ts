import { User } from '../entity/user';

export interface UserRepository {
  getUserById(userId: string): Promise<User | null>;
  getUserByEmail(email: string): Promise<User | null>;
  create(user: User): Promise<void>;
}

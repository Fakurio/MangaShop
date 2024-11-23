import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { User } from '../../entities/user.entity';
import { DataSource } from 'typeorm';

@Injectable()
export class UsersService {
  constructor(private readonly dataSource: DataSource) {}

  async getUserName(user_id: number): Promise<User> {
    const user = await this.dataSource
      .getRepository(User)
      .createQueryBuilder('user')
      .select('user.name')
      .where('user.user_id = :user_id', { user_id: user_id })
      .getOne();

    if (!user) {
      throw new HttpException('User does not exist', HttpStatus.NOT_FOUND);
    }

    return user;
  }

  async findOne(email: string): Promise<User | null> {
    const user = await this.dataSource
      .getRepository(User)
      .createQueryBuilder('user')
      .where('user.email = :email', { email: email })
      .getOne();

    return user;
  }

  async findByRefreshToken(rT: string) {
    return await this.dataSource
      .getRepository(User)
      .createQueryBuilder('user')
      .where('user.refresh_token = :rT', { rT: rT })
      .getOne();
  }

  async checkUser(email: string): Promise<boolean> {
    const user = await this.dataSource
      .getRepository(User)
      .exist({ where: { email: email } });

    return user;
  }

  async addNewUser(username: string, email: string, password: string) {
    return await this.dataSource
      .createQueryBuilder()
      .insert()
      .into(User)
      .values({ name: username, email: email, password: password })
      .execute();
  }

  async updateRefreshToken(id: number, rf: string) {
    return await this.dataSource
      .createQueryBuilder()
      .update(User)
      .set({ refresh_token: rf })
      .where('user_id = :id', { id: id })
      .execute();
  }
}

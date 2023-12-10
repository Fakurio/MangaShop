import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { User } from 'src/entities/user.entity';
import { DataSource } from 'typeorm';

@Injectable()
export class UsersService {
  constructor(private readonly dataSource: DataSource) {}

  async getUserName(user_id: number): Promise<User> {
    const user = await this.dataSource
      .getRepository(User)
      .createQueryBuilder('user')
      .select('user.name')
      .getOne();

    if (!user) {
      throw new HttpException('User does not exist', HttpStatus.NOT_FOUND);
    }

    return user;
  }
}

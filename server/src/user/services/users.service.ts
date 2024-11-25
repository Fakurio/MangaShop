import {HttpException, HttpStatus, Injectable} from '@nestjs/common';
import {User} from '../../entities/user.entity';
import {Repository} from 'typeorm';
import {InjectRepository} from "@nestjs/typeorm";

@Injectable()
export class UsersService {
  constructor(
      @InjectRepository(User)
      private readonly usersRepository: Repository<User>
  ) {}

  async getUserName(user_id: number): Promise<User> {
    const user = await this.usersRepository
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
    return await this.usersRepository
        .createQueryBuilder('user')
        .where('user.email = :email', {email: email})
        .getOne();
  }

  async findByRefreshToken(rT: string) {
    return await this.usersRepository
      .createQueryBuilder('user')
      .where('user.refresh_token = :rT', { rT: rT })
      .getOne();
  }

  async checkUser(email: string): Promise<boolean> {
    return await this.usersRepository
        .exist({where: {email: email}});
  }

  async addNewUser(username: string, email: string, password: string) {
    const user = new User;
    user.email = email;
    user.password = password;
    user.name = username;

    return await this.usersRepository.save(user);
  }

  async updateRefreshToken(id: number, rf: string) {
    return await this.usersRepository.update(
        { user_id: id },
        { refresh_token: rf }
    )
  }
}

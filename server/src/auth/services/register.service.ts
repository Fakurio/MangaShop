import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { RegisterUserDto } from '../dto/register-user.dto';
import { UsersService } from 'src/user/services/users.service';
import RegisterUserSchema from '../dto/register-user.dto';
import { HashService } from './hash.service';
import { DataSource } from 'typeorm';
import { User } from 'src/entities/user.entity';

@Injectable()
export class RegisterService {
  constructor(
    private usersService: UsersService,
    private hashService: HashService,
    private dataSource: DataSource,
  ) {}

  async registerUser(registerUserDto: RegisterUserDto) {
    const { username, email, password } = registerUserDto;

    if (!RegisterUserSchema.safeParse(registerUserDto).success) {
      throw new HttpException(
        'Incorrect registration data',
        HttpStatus.BAD_REQUEST,
      );
    }

    let userExists = await this.usersService.checkUser(email);
    if (userExists) {
      throw new HttpException(
        'User with given e-mail already exists',
        HttpStatus.CONFLICT,
      );
    }

    let hashedPassword = await this.hashService.hashPassword(password);
    try {
      await this.usersService.addNewUser(username, email, hashedPassword);

      return {
        message: 'User registered successfully',
      };
    } catch (err) {
      throw new HttpException(
        'Failed to register user',
        HttpStatus.UNPROCESSABLE_ENTITY,
      );
    }
  }
}

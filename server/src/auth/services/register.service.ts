import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { RegisterUserDto } from '../dto/register-user.dto';
import { UsersService } from '../../user/services/users.service';
import RegisterUserSchema from '../dto/register-user.dto';
import { HashService } from './hash.service';

@Injectable()
export class RegisterService {
  constructor(
    private usersService: UsersService,
    private hashService: HashService,
  ) {}

  private async validateUser(registerUserDto: RegisterUserDto) {
    const { email } = registerUserDto;

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

    return registerUserDto;
  }

  async registerUser(registerUserDto: RegisterUserDto) {
    const { email, password, username } = await this.validateUser(registerUserDto);
    try {
      let hashedPassword = await this.hashService.hashPassword(password);
      await this.usersService.addNewUser(username, email, hashedPassword);
      return {
        message: 'User registered successfully',
      };
    } catch (err) {
      console.log(err);
      throw new HttpException(
        'Failed to register user',
        HttpStatus.UNPROCESSABLE_ENTITY,
      );
    }
  }
}

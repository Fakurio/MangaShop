import { UsersService } from 'src/user/services/users.service';
import { HashService } from './hash.service';
import LoginUserSchema from '../dto/login-user.dto';
import { LoginUserDto } from '../dto/login-user.dto';
import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';

@Injectable()
export class LoginService {
  constructor(
    private usersService: UsersService,
    private hashService: HashService,
    private jwtService: JwtService,
  ) {}

  async loginUser(loginUserDto: LoginUserDto) {
    const { email, password } = loginUserDto;

    if (!LoginUserSchema.safeParse(loginUserDto).success) {
      throw new HttpException('Incorrect login data', HttpStatus.BAD_REQUEST);
    }

    const user = await this.usersService.findOne(email);
    if (!user) {
      throw new HttpException(
        "User doesn't exist in database",
        HttpStatus.BAD_REQUEST,
      );
    }

    const isPasswordMatch = await this.hashService.verifyPassword(
      password,
      user.password,
    );

    if (!isPasswordMatch) {
      throw new HttpException('Bad password', HttpStatus.UNAUTHORIZED);
    }

    const payload = { sub: user.user_id, email: user.email };
    return {
      access_token: await this.jwtService.signAsync(payload),
    };
  }
}

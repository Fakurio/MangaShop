import { UsersService } from 'src/user/services/users.service';
import { HashService } from './hash.service';
import LoginUserSchema from '../dto/login-user.dto';
import { LoginUserDto } from '../dto/login-user.dto';
import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { Response } from 'express';
import { CartsService } from 'src/cart/services/carts.service';

@Injectable()
export class LoginService {
  constructor(
    private usersService: UsersService,
    private hashService: HashService,
    private jwtService: JwtService,
    private cartService: CartsService,
  ) {}

  async loginUser(loginUserDto: LoginUserDto, response: Response) {
    const { email, password, cart } = loginUserDto;

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

    const userCart = await this.cartService.getUserCart(user.user_id);
    let finalCart = cart;
    if (userCart) {
      finalCart = this.cartService.mergeCarts(cart, userCart);
      finalCart = this.cartService.removeCartID(finalCart);
    }

    const payload = {
      sub: user.user_id,
      email: user.email,
      username: user.name,
    };
    const aT = await this.jwtService.signAsync(payload);
    const rT = await this.jwtService.signAsync(payload, {
      expiresIn: '1d',
    });

    await this.usersService.updateRefreshToken(user.user_id, rT);
    response.cookie('jwt', rT, { httpOnly: true, maxAge: 24 * 60 * 60 * 1000 });
    return {
      username: user.name,
      new_cart: finalCart,
      access_token: aT,
    };
  }
}

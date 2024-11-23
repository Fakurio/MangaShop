import { UsersService } from '../../user/services/users.service';
import { HashService } from './hash.service';
import LoginUserSchema from '../dto/login-user.dto';
import { LoginUserDto } from '../dto/login-user.dto';
import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { Response } from 'express';
import { CartsService } from '../../cart/services/carts.service';
import {User} from "../../entities/user.entity";
import {ConfigService} from "@nestjs/config";

@Injectable()
export class LoginService {
  constructor(
    private usersService: UsersService,
    private hashService: HashService,
    private jwtService: JwtService,
    private cartService: CartsService,
    private configService: ConfigService,
  ) {}

  private async validateUser(loginUserDto: LoginUserDto) {
    const { email, password } = loginUserDto;

    if (!LoginUserSchema.safeParse(loginUserDto).success) {
      throw new HttpException('Incorrect login data', HttpStatus.BAD_REQUEST);
    }

    const user = await this.usersService.findOne(email);
    if (!user) {
      console.log("User does not exist");
      throw new HttpException(
          "Incorrect login data",
          HttpStatus.BAD_REQUEST,
      );
    }

    const isPasswordMatch = await this.hashService.verifyPassword(
        password,
        user.password,
    );

    if (!isPasswordMatch) {
      console.log("Bad password")
      throw new HttpException('Incorrect login data', HttpStatus.UNAUTHORIZED);
    }

    return user;
  }

  private async updateUserCart(user: User, cart: LoginUserDto["cart"]) {
    const userCart = await this.cartService.getUserCart(user.user_id);
    let finalCart = cart;
    if (userCart) {
      const mergedCart = this.cartService.mergeCarts(cart, userCart);
      finalCart = this.cartService.removeCartID(mergedCart);
    }
    return finalCart;
  }

  private async generateTokens(user: User) {
    const payload = {
      sub: user.user_id,
      email: user.email,
      username: user.name,
    };
    const aT = await this.jwtService.signAsync(payload);
    const rT = await this.jwtService.signAsync(payload, {
      expiresIn: this.configService.get("JWT_REFRESH_EXPIRES_IN"),
    });

    return { aT, rT }
  }

  async loginUser(loginUserDto: LoginUserDto, response: Response) {
    const user = await this.validateUser(loginUserDto);
    const finalCart = await this.updateUserCart(user, loginUserDto.cart)
    const { aT, rT } = await this.generateTokens(user);

    await this.usersService.updateRefreshToken(user.user_id, rT);

    response.cookie('jwt', rT, { httpOnly: true, maxAge: Number(this.configService.get("COOKIE_MAX_AGE")) });
    return {
      username: user.name,
      new_cart: finalCart,
      access_token: aT,
    };
  }
}
